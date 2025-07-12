export interface IPaginatedResult<T> {
  /**
   * Current page number (1-based index).
   * Used by frontend to show "Page 3 of 5".
   *
   * Example Value: 1 (first page)
   *
   */
  pageNumber: number;

  /**
    * Max items per page.
    * Defined by the request (e.g., pageSize=20).
    * 
    * Example Value: 20, 15, 10
    
    */
  pageSize: number;

  /**
   * Total matching records (ignoring pagination).
   * Used to calculate progress (e.g., "Showing 20 of 100").
   *
   * Example Value: 100 (total DB matches)
   */
  totalItems: number;

  /**
   * The paginated records for the current page.
   * Contains only the subset of results matching the query (limited by pageSize).
   *
   * Example Value: User[], Product[]
   */
  data: T[];
}
