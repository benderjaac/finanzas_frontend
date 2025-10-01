export interface Gasto{
    id: number,
    fecha: string,
    descri: string,
    monto: number,
    idusuario: number,
    contado: boolean,
    editing?: boolean,
    categoriaColor: string,
    categoriaIcon: string,
    categoriaNombre: string,
    categoria_id: number
}