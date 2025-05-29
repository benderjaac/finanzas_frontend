export interface ApiFilter{
    field: string,
    operator: string,
    value: any,
    tyoe: string
}

export interface ApiSort{
    field: string,
    order: "ASC" | "DESC";
}

export interface ApiPagination{
    perPage: number,
    currentPage: number
}

export interface ApiQuery {
    filters: ApiFilter[],
    sorter: ApiSort[],
    pagination: ApiPagination
}