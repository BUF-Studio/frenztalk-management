interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
  }

export default PaginatedResult;