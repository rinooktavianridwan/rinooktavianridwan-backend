export interface PaginationQuery {
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export class PaginationUtil {
  private static readonly DEFAULT_PER_PAGE = 10;
  private static readonly MIN_PER_PAGE = 10;
  private static readonly MAX_PER_PAGE = 100;

  /**
   * Validate and normalize pagination parameters
   * @param query - Raw pagination query parameters
   * @returns Normalized pagination parameters
   */
  static validatePaginationQuery(query: PaginationQuery): {
    page: number;
    per_page: number;
    skip: number;
    take: number;
  } {
    // Normalize page (default: 1, minimum: 1)
    const page = Math.max(1, Number(query.page) || 1);

    // Normalize per_page (default: 10, min: 10, max: 100)
    let per_page = Number(query.per_page) || this.DEFAULT_PER_PAGE;
    per_page = Math.max(
      this.MIN_PER_PAGE,
      Math.min(this.MAX_PER_PAGE, per_page),
    );

    // Calculate skip and take for database query
    const skip = (page - 1) * per_page;
    const take = per_page;

    return {
      page,
      per_page,
      skip,
      take,
    };
  }

  /**
   * Create pagination metadata
   * @param page - Current page number
   * @param per_page - Items per page
   * @param total - Total items count
   * @returns Pagination metadata
   */
  static createMeta(
    page: number,
    per_page: number,
    total: number,
  ): PaginationMeta {
    const total_pages = Math.ceil(total / per_page);

    return {
      current_page: page,
      per_page,
      total,
      total_pages,
      has_next_page: page < total_pages,
      has_prev_page: page > 1,
    };
  }

  /**
   * Create paginated response
   * @param data - Array of data items
   * @param page - Current page number
   * @param per_page - Items per page
   * @param total - Total items count
   * @returns Paginated response object
   */
  static createPaginatedResponse<T>(
    data: T[],
    page: number,
    per_page: number,
    total: number,
  ): PaginatedResponse<T> {
    const meta = this.createMeta(page, per_page, total);

    return {
      data,
      meta,
    };
  }
}
