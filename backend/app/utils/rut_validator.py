import re

def _clean_rut(raw: str) -> str: # "_" -> Uso interno
    """
    Corrige RUT, quita puntos, guiones y espacios,
    lo deja en mayusculas para digito verificador
    """
    return re.sub(r"[^0-9kK]", "", raw).upper()


def _compute_dv(body: str) -> str: # "_" -> Uso interno
    """
    Calcula digito verificador "chileno"
    body solo numeros sin digito verificador,
    devuelve digito verificador de 0-9 o K
    """
    reversed_digits = map(int, reversed(body))
    factors = [2, 3, 4, 5, 6, 7]
    s = 0
    factor_idx = 0

    for d in reversed_digits:
        s += d * factors[factor_idx]
        factor_idx = (factor_idx + 1) % len(factors)

    mod = 11 - (s % 11)
    if mod == 11:
        return "0"
    if mod == 10:
        return "K"
    return str(mod)


def normalize_and_validate_rut(raw: str) -> str:
    """
    Valida RUT de "chile" y lo devuelve normalizado 'XXXXXXXX-digitoV'.

    Acepta formatos:
    - 12345678-5
    - 12.345.678-5
    - 123456785
    - 12345678-k
    """
    if not raw or not raw.strip():
        raise ValueError("Se necesita un RUT")

    cleaned = _clean_rut(raw)

    if len(cleaned) < 2:
        raise ValueError("RUT inválido")

    body, dv = cleaned[:-1], cleaned[-1]

    if not body.isdigit():
        raise ValueError("El RUT debe ser numerico")

    if dv not in "0123456789K":
        raise ValueError("Dígito verificador debe ser de 0-9 o K")

    # Evitar cuerpos tipo "00000000"
    if int(body) == 0:
        raise ValueError("El RUT es inválido")

    expected = _compute_dv(body)
    if dv != expected:
        raise ValueError("El dígito verificador no es correcto")

    return f"{int(body)}-{dv}"
