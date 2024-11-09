import React from "react";
import {DataGrid} from "@mui/x-data-grid";

const colunas = [
    {field: "id", headerName: "Cod cliente", width: 90},
    {field: "nome", headerName: "nome cliente", width: 180},
    {field: "email", headerName: "email cliente", width: 180},
]

const clientes = [
    {id: 1, nome: 'eduardo', email: 'eduardof.miotto@gmail.com'},
    {id: 2, nome: 'xiruzinho', email: 'radiosuper@conda.ong.br'},
    {id: 1, nome: 'eduardo', email: 'eduardof.miotto@gmail.com'},
    {id: 2, nome: 'xiruzinho', email: 'radiosuper@conda.ong.br'},
    {id: 1, nome: 'eduardo', email: 'eduardof.miotto@gmail.com'},
    {id: 2, nome: 'xiruzinho', email: 'radiosuper@conda.ong.br'}
]

function Lista() {
    return <div>
        <DataGrid columns={colunas} rows={clientes} />
    </div>
}

export default Lista;