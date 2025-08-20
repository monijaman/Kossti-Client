export const LOCALES = ["en", "bn"];
export const DEFAULT_LOCALE = "en";

export const apiEndpoints = {
  // Authentication endpoints
  register: "/register",
  login: "/login",
  refreshToken: "/refresh-token",
  registration: "/registration",
  loginV1: "/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  logout: "/logout",
  checkToken: "/check-token",
  searchUsers: "/search_users",
  profile: "/profile",
  checkRole: "/checkrole",

  // User endpoints
  users: "/users",
  allUsers: "/users/all",
  searchUsersApi: "/users/search",
  userCount: "/users/count",
  getUserById: (id: number | string) => `/users/${id}`,

  // Product endpoints
  getProducts: "/products",
  createProduct: "/products",
  getProductById: (id: number | string) => `/products/${id}`,
  updateProduct: (id: number | string) => `/products/${id}`,
  getProductBySlug: (slug: string) => `/products-by-slug/${slug}`,
  getPopularProducts: "/popular-products",
  incrementProductViews: (id: number | string) =>
    `/products/${id}/increment-views`,

  // Category endpoints
  getCategories: "/categories",
  createCategory: "/categories",
  getCategoryById: (id: number | string) => `/categories/${id}`,
  category: (id: number | string) => `/categories/${id}`,
  deleteCategory: (id: number | string) => `/categories/${id}`,
  getWideCategories: "/wide-categories",
  categoryTranslation: "/category-translation",
  categoryTranslationById: (categoryId: number | string) =>
    `/category-translation/${categoryId}`,
  getCategoryTranslation: (id: number | string) =>
    `/category-translation/${id}`,
  createCategoryBrands: "/category-brands",
  getCategoryBrands: "/category-brands",
  updateCategoryStatus: (id: number | string) => `/category-status/${id}`,

  // Brand endpoints

  getBrands: "/brands",
  brandTranslation: (brandId: number) => `/brand-translation/${brandId}`,
  brandTrans: () => `/brand-translation`,
  Brands: (brandId: number) => `/brands/${brandId}`,
  Brand: "/brands",
  getBrandById: (id: number | string) => `/brands/${id}`,
  updateBrand: (id: number | string) => `/brands/${id}`,
  deleteBrand: (id: number | string) => `/brands/${id}`,
  getPublicBrands: "/public-brands",
  BrandStatus: (brand_id: number) => `/brand-status/${brand_id}`, //post

  // Specification endpoints
  getSpecificationById: (id: number | string) => `/specifications/${id}`,
  updateSpecification: (id: number | string) => `/specifications/${id}`,
  deleteSpecification: (id: number | string) => `/specifications/${id}`,
  searchSpecifications: "/specificationsearch",
  createSpecTranslation: "/spec_translation",
  getSpecTranslation: (id: number | string) => `/spec_translation/${id}`,
  getPublicSpecs: (productId: number) => `/get-public-spec/${productId}`,
  getSpecKeys: "/speckey",
  createSpecKey: "/speckey",
  getSpecKeyById: (id: number | string) => `/speckey/${id}`,
  removeSpec: (id: number | string) => `/specremove/${id}`,
  getSpecKeyTranslations: "/speckey-translation",
  createSpecKeyTranslation: "/speckey-translation",

  // FormGenerator endpoints
  createFormGenerator: "/formgenerator",
  getFormGeneratorById: (id: number | string) => `/formgenerator/${id}`,
  updateFormGenerator: (id: number | string) => `/formgenerator/${id}`,
  getCategorySpecs: (categoryId: number | string) =>
    `/catgory-specs/${categoryId}`,

  // Feedback endpoints
  getFeedbacks: "/feedbacks",
  createFeedback: "/feedbacks",
  getFeedbackById: (id: number | string) => `/feedbacks/${id}`,
  updateFeedback: (id: number | string) => `/feedbacks/${id}`,
  deleteFeedback: (id: number | string) => `/feedbacks/${id}`,
  getFeedbackTranslations: (id: number | string) =>
    `/feedbacks/${id}/translations`,

  // Health check
  health: "/health",

  // Review endpoints (existing)
  getPublicReviewsByProductId: (id: number | string, countryCode: string) =>
    `/public-reviews/${id}?locale=${countryCode}`,
  getReviews: `get`,
  submitBrands: (brandid: number) => `category-brands/${brandid}`,
  getAProductById: (id: number) => `product/${id}`,
};

export const API_ROUTES = {
  categories: "wide-categories",
  brands: "wide-brands",
  products: "products",
  popularProducts: "popular-products",
};
