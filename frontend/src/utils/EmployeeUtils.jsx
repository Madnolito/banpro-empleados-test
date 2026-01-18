// deja solo 0-9 y K
export function cleanRut(raw) {
  return raw.toUpperCase().replace(/[^0-9K]/g, "").slice(0, 9);
}

// Formatea al estar completo XXXXXXXX-D
export function formatRutIfComplete(cleaned, forceEightAsComplete = false) {
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
  }
  if (forceEightAsComplete && cleaned.length === 8) {
    return `${cleaned.slice(0, 7)}-${cleaned.slice(7)}`;
  }
  return cleaned; // incompleto se deja sin guion
}

export function isRutValidFinal(val) {
  // vacio = permitido (sin filtro)
  if (!val) return true;
  return /^\d{7,8}-[0-9K]$/.test(val);
}