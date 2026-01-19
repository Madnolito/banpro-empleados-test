from app.utils.rut_validator import normalize_and_validate_rut


def employee_payload(rut_raw: str = "12.345.678-5"):
    return {
        "rut": rut_raw,
        "nombre": "Manu Tapia",
        "fecha_nacimiento": "1990-01-01",
        "cargo": "Dev",
        "departamento": "TI",
        "fecha_ingreso": "2024-01-01",
        "activo": True,
    }


def test_create_employee_ok(client):
    raw_rut = "12.345.678-5"
    res = client.post("/employees", json=employee_payload(raw_rut))
    assert res.status_code == 201

    data = res.json()
    assert "id" in data
    assert data["rut"] == normalize_and_validate_rut(raw_rut)  # validador de rut
    assert data["nombre"] == "Manu Tapia"
    assert data["activo"] is True


def test_create_employee_duplicate_rut_400(client):
    raw_rut = "12.345.678-5"

    res1 = client.post("/employees", json=employee_payload(raw_rut))
    assert res1.status_code == 201

    res2 = client.post("/employees", json=employee_payload(raw_rut))
    assert res2.status_code == 400
    assert "rut ya existe" in res2.json()["detail"].lower()


def test_create_employee_invalid_rut_422(client):
    res = client.post("/employees", json=employee_payload("123"))
    assert res.status_code == 422  # validator


def test_list_employees_basic(client):
    res1 = client.post("/employees", json=employee_payload("12.345.678-5"))
    assert res1.status_code == 201

    res2 = client.post("/employees", json=employee_payload("11.111.111-1"))
    assert res2.status_code == 201

    res = client.get("/employees")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) == 2


def test_list_employees_pagination(client):
    # crea 3
    assert client.post("/employees", json=employee_payload("12.345.678-5")).status_code == 201
    assert client.post("/employees", json=employee_payload("11.111.111-1")).status_code == 201
    assert client.post("/employees", json=employee_payload("9.876.543-3")).status_code == 201

    res = client.get("/employees", params={"page": 1, "page_size": 2})
    assert res.status_code == 200
    assert len(res.json()) == 2


def test_get_employee_detail_ok(client):
    created = client.post("/employees", json=employee_payload("12.345.678-5"))
    assert created.status_code == 201
    emp = created.json()

    res = client.get(f"/employees/{emp['id']}")
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == emp["id"]
    assert data["rut"] == emp["rut"]


def test_get_employee_detail_not_found_404(client):
    res = client.get("/employees/999999")
    assert res.status_code == 404
    assert "no encontrado" in res.json()["detail"].lower()


def test_update_employee_ok(client):
    created = client.post("/employees", json=employee_payload("12.345.678-5"))
    assert created.status_code == 201
    emp_id = created.json()["id"]

    res = client.put(
        f"/employees/{emp_id}",
        json={"nombre": "Manuel Tapia", "departamento": "Datos"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["nombre"] == "Manuel Tapia"
    assert data["departamento"] == "Datos"


def test_update_employee_not_found_404(client):
    # nombre min_length=2
    res = client.put("/employees/999999", json={"nombre": "XX"})
    assert res.status_code == 404
    assert "no encontrado" in res.json()["detail"].lower()


def test_delete_employee_deactivates(client):
    created = client.post("/employees", json=employee_payload("12.345.678-5"))
    assert created.status_code == 201
    emp = created.json()

    res = client.delete(f"/employees/{emp['id']}")
    assert res.status_code == 200
    data = res.json()

    assert data["id"] == emp["id"]
    assert data["activo"] is False

    # filtro por activo
    res_activos = client.get("/employees", params={"activo": "true"})
    assert res_activos.status_code == 200
    ids_activos = [e["id"] for e in res_activos.json()]
    assert emp["id"] not in ids_activos

    res_inactivos = client.get("/employees", params={"activo": "false"})
    assert res_inactivos.status_code == 200
    ids_inactivos = [e["id"] for e in res_inactivos.json()]
    assert emp["id"] in ids_inactivos
