export const getPagination = (
  query: any,
  defaultPage = 1,
  defaultPageSize = 10
) => {
  const page_number = Number(query.page_number || defaultPage);
  const page_size = Number(query.page_size || defaultPageSize);
  const skip = (page_number - 1) * page_size;
  const take = page_size;
  return { page_number, page_size, skip, take };
};
