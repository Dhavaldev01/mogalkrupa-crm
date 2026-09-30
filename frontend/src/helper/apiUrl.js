export const ApiUrl = {
    // getApiDummy: {
    //     getUrl: "/store/store/dummyEndpoint",
    //     key: "user"
    // },

    getCategoryRegister: {
        getUrl: "category/store/getAllCategoriesTree",
        key: "category-reg"
    },
    postRegister: {
        getUrl: "store/store/register",
        key: ""
    },
    postLogin: {
        getUrl: "store/store/newLogin",
        key: ""
    },
    getStoreWiseCategoryTree: {
        getUrl: "category/store/getStoreWiseCategoryTree",
        key: "category-add"
    },
    addProduct: {
        getUrl: "product/store/addProduct",
        key: "add-product"
    },
    newAddProduct: {
        getUrl: "product/store/new/newAddProduct",
        key: "new-addProduct"
    },

    getProduct: {
        getUrl: "product/store/getProductDetailsById",
        key: "get-product"
    },
    getAttributesByCategory: {
        getUrl: "attribute/store/getAttributesByCategory",
        key: "get-attributesByCategory"
    },
    getMyAccount: {
        getUrl: "store/store/getStoreDetails",
        key: "get-myAccount"
    },
    postMyAccount: {
        getUrl: "store/store/updateStoreProfile",
        key: "post-myAccount"
    },
    getAllState: {
        getUrl: "store/store/getAllStates",
        key: "get-allState"
    },
    getAllCity: {
        getUrl: "store/store/getAllCity",
        key: "get-allCity"
    },
    getInventoryProductCount: {
        getUrl: "product/store/getStoreWiseProductCount",
        key: "get-inventoryProductCount"
    },
    getAllProducts: {
        getUrl: "product/store/getStoreWiseAllProducts",
        key: "get-allProducts"
    },
    getAllProductsVariant: {
        getUrl: "product/store/getStoreWiseProductById",
        key: "get-allProductsVariant"
    },
    getAllCustomer: {
        getUrl: "customer/store/getAllCustomer",
        key: "get-allCustomer"
    },
    getAllCategory: {
        getUrl: "category/store/getAllCategoriesTreeByStore",
        key: "get-allCategory"
    },
    getBillAllProducts: {
        getUrl: "product/store/createBillUseProduct",
        key: "get-billAllProducts"
    },
    getAllCartProduct: {
        getUrl: "cart/store/getAllCartProduct",
        key: "get-allCartProduct"
    },
    getPreviewBill: {
        getUrl: "cart/store/previewBill/",
        key: "get-previewBill"
    },
    getCreateBillSearchProduct: {
        getUrl: "product/store/createBillSearchProduct",
        key: "get-createBillSearchProduct"
    },
    getAllBooking: {
        getUrl: "cart/store/bookingListing",
        key: "get-allBooking"
    },
    getBookingWidgetCount: {
        getUrl: "cart/store/bookingCount",
        key: "get-bookingWidgetCount"
    },
    getAddCategory: {
        getUrl: "category/store/getRemainingCategoriesTreeByStore",
        key: "get-addCategory"
    },
    putSendCategory: {
        getUrl: "category/store/updateStoreCategories",
        key: "put-sendCategory"
    },
    postAddCustomer: {
        getUrl: "customer/store/addCustomer",
        key: "post-addCustomer"
    },
    getCustomerDetails: {
        getUrl: "customer/store/getCustomerDetailsWithOrder",
        key: "get-customerDetails"
    },
    getCustomerData: {
        getUrl: "customer/store/getCustomerDetails",
        key: "get-customerdata"
    },
    getAllCustomerData: {
        getUrl: "customer/store/getAllCustomerForBill",
        key: "get-allCustomerData"
    },
    getAddProductToCart: {
        getUrl: "cart/store/addProductToCart",
        key: "get-addProductToCart"
    },
    getCartProductByCustomerId: {
        getUrl: "cart/store/getAllCartProductByCustomerId",
        key: "get-cartProductByCustomerId"
    },
    getRemoveProductToCart: {
        getUrl: "cart/store/removeCartProduct",
        key: "get-removeProductToCart"
    },
    createBill: {
        getUrl: "cart/store/generateBill",
        key: "new-createBill"
    },
    getAllEmployeeByStore: {
        getUrl: "employee/store/getAllEmployeeByStore",
        key: "get-allEmployeeByStore"
    },
    getOrderDetails: {
        getUrl: "cart/store/getBookingDetails",
        key: "get-bookingDetails"
    },
    getAllProductByOrderDetails: {
        getUrl: "cart/store/getAllProductByBookingDetails",
        key: "get-allProductByBookingDetails"
    },
    getCheckProductAvailability: {
        getUrl: "product/store/checkProductAvailability",
        key: "get-checkProductAvailability"
    },
    postAddEmployee: {
        getUrl: "employee/store/createEmployee",
        key: "post-addEmployee"
    },
    getAllEpmloyee: {
        getUrl: "employee/store/listAllEmployeeByStore",
        key: "get-allEpmloyee"
    },
    getAllOrder: {
        getUrl: "cart/store/orderListing",
        key: "get-allOrder"
    },
    getRetailOrderDetails: {
        getUrl: "cart/store/getOrderDetails",
        key: "get-retailOrderDetails"
    },
    getRetailAllProductByOrderDetails: {
        getUrl: "cart/store/getAllProductByOrderDetails",
        key: "get-retailAllProductByOrderDetails"
    },
    getRemoveAllCartProduct: {
        getUrl: "cart/store/removeAllCartProduct",
        key: "get-removeAllCartProduct"
    },
    addCartProductNote: {
        getUrl: "cart/store/addCartProductNote",
        key: "add-cartProductNote"
    },
    getBarcodeByProductVariantId: {
        getUrl: "product/store/getBarcodeByProductVariantId",
        key: "get-barcodeByProductVariantId"
    },
    getAllProductByBarCode: {
        getUrl: "product/store/getAllProductByBarCode",
        key: "get-allProductByBarCode"
    },
    getSingalOrderDetailsByOrderId: {
        getUrl: "cart/store/getSingalOrderDetailsByOrderId/",
        key: "get-singalOrderDetailsByOrderId"
    },
    getAllProductByReturnAndExchange: {
        getUrl: "product/store/getAllProductByReturnAndExchange",
        key: "get-allProductByReturnAndExchange"
    },
    retailOrderReturnAndExchange: {
        getUrl: "cart/store/retailOrderReturnAndExchange",
        key: "get-retailOrderReturnAndExchange"
    },
    updateSettlementDiscount: {
        getUrl: "cart/store/updateSettlementDiscount",
        key: "post-updateSettlementDiscount"
    },
    getAllPlans: {
        getUrl: "plan/user/getAllPlans",
        key: "get-allPlans"
    },
    createOrder: {
        getUrl: "payment/create-order",
        key: "get-createOrder"
    },
    paymentVerify: {
        getUrl: "payment/verify",
        key: "get-paymentVerify"
    },
    viewRentBookingReturnDetails: {
        getUrl: "cart/store/viewRentBookingReturnDetails",
        key: "get-viewRentBookingReturnDetails"
    },
    getBookingProductList: {
        getUrl: "cart/store/getBookingProductList",
        key: "get-bookingProductList"
    },
    rentBookingReturn: {
        getUrl: "cart/store/rentBookingReturn",
        key: "post-rentBookingReturn"
    },
    getAllRoles: {
        getUrl: "role/getAllRoles",
        key: "get-allRoles"
    },
    getRoleDetails: {
        getUrl: "role/getRoleDetails",
        key: "get-roleDetails"
    },
    addRole: {
        getUrl: "role/addRole",
        key: "add-addRole"
    },
    getRolePermissions: {
        getUrl: "permissions/getRolePermissions",
        key: "get-rolePermissions"
    },
    getOrderCount: {
        getUrl: "cart/store/orderCount",
        key: "get-orderCount"
    },
    getProductPerformanceReport: {
        getUrl: "report/store/getProductPerformanceReport",
        key: "get-productPerformanceReport"
    },
    getPendingBillsReport: {
        getUrl: "report/store/getPendingBillsReport",
        key: "get-pendingBillsReport"
    },
    patchEditEmployee: {
        getUrl: "employee/store/editEmployee",
        key: "patch-editEmployee"
    },
    getEmployeeDetails: {
        getUrl: "employee/store/getEmployeeDetails",
        key: "patch-employeeDetails"
    },
    putUpdateEmployeeStatus: {
        getUrl: "employee/store/updateEmployeeStatus",
        key: "put-updateEmployeeStatus"
    },
    getListBankDetails: {
        getUrl: "bank/store/listBankDetails",
        key: "get-listBankDetails"
    },
    postAddBankDetails: {
        getUrl: "bank/store/addBankDetails",
        key: "post-addBankDetails"
    },
    patchUpdateBankDetails: {
        getUrl: "bank/store/updateBankDetails",
        key: "patch-updateBankDetails"
    },
    getBankDetails: {
        getUrl: "bank/store/getBankDetails",
        key: "get-bankDetails"
    },
    getAllExpenseTypes: {
        getUrl: "expensetype/user/getAllExpenseTypes",
        key: "get-allExpenseTypes"
    },
    putUpdateBankDetailsStatus: {
        getUrl: "bank/store/updateBankDetailsStatus",
        key: "put-updateBankDetailsStatus"
    },
    postChangePassword: {
        getUrl: "store/store/changePassword",
        key: "post-changePassword"
    },
    getAllBankName: {
        getUrl: "bank/store/getAllBankName",
        key: "get-allBankName"
    },
    getAllExpense: {
        getUrl: "expense/store/getAllExpense",
        key: "get-allExpense"
    },
    postCreateExpense: {
        getUrl: "expense/store/createExpense",
        key: "post-createExpense"
    },
    getUpdateExpense: {
        getUrl: "expense/store/updateExpense",
        key: "get-updateExpense"
    },
    getIncomeAndExpense: {
        getUrl: "report/store/getIncomeAndExpense",
        key: "get-incomeAndExpense"
    },
    getListingReturnOrderProduct: {
        getUrl: "cart/store/listingReturnOrderProduct",
        key: "get-listingReturnOrderProduct"
    },
    getListAllVendor: {
        getUrl: "vendor/store/listAllVendor",
        key: "get-listAllVendor"
    },
    postAddVendor: {
        getUrl: "vendor/store/addVendor",
        key: "post-addVendor"
    },
    editVendor: {
        getUrl: "vendor/store/editVendor",
        key: "post-editVendor"
    },
    getVendor: {
        getUrl: "vendor/store/getVendor",
        key: "post-getVendor"
    },
    putEditVendorStatus: {
        getUrl: "vendor/store/editVendorStatus",
        key: "put-editVendorStatus"
    },
    getIncomeAndExpenseCount: {
        getUrl: "report/store/getIncomeAndExpenseCount",
        key: "get-incomeAndExpenseCount"
    },
    getListAllVendorName: {
        getUrl: "vendor/store/listAllVendorName",
        key: "get-listAllVendorName"
    },
    getAllProductByPurchaseBill: {
        getUrl: "product/store/getAllProductByPurchaseBill",
        key: "get-allProductByPurchaseBill"
    },
    postCreatePurchaseInvoice: {
        getUrl: "purchaseInvoice/store/createPurchaseInvoice",
        key: "post-createPurchaseInvoice"
    },
    getAllPurchaseInvoice: {
        getUrl: "purchaseInvoice/store/getAllPurchaseInvoice",
        key: "get-allPurchaseInvoice"
    },
    getEditExpense: {
        getUrl: "expense/store/getExpense",
        key: "get-editExpense"
    },
    getAccountLedger: {
        getUrl: "report/store/getAccountLedger",
        key: "get-accountLedger"
    },
    getAllIncome: {
        getUrl: "income/store/getAllIncome",
        key: "get-allIncome"
    },
    postCreateIncome: {
        getUrl: "Income/store/createIncome",
        key: "post-createIncome"
    },
    getUpdateIncome: {
        getUrl: "income/store/updateIncome",
        key: "get-updateIncome"
    },
    getEditIncome: {
        getUrl: "income/store/getIncome",
        key: "get-editIncome"
    },
    getAllPrintTemplateByStore: {
        getUrl: "printTemplate/store/getAllPrintTemplateByStore",
        key: "get-allPrintTemplateByStore"
    },
    getAllPrintTemplateName: {
        getUrl: "printTemplate/store/getAllPrintTemplateName",
        key: "get-allPrintTemplateName"
    },
    getDashboardOverview: {
        getUrl: "dashboard/store/dashboardOverview",
        key: "get-dashboardOverview"
    },
    getBillRender: {
        getUrl: "printTemplate/store/getBillRender",
        key: "get-billRender"
    },
    getTopEmployee: {
        getUrl: "dashboard/store/topEmployee",
        key: "get-topEmployee"
    },
    getRecentBills: {
        getUrl: "dashboard/store/recentBills",
        key: "get-recentBills"
    },
    postRetailOrderCancel: {
        getUrl: "cart/store/retailOrderCancel",
        key: "post-retailOrderCancel"
    },
    getLoginActivity: {
        getUrl: "dashboard/store/loginActivity",
        key: "get-loginActivity"
    },
    getProductPerformanceDetailOverview: {
        getUrl: "report/store/productPerformanceDetailOverview",
        key: "get-productPerformanceDetailOverview"
    },
    getProductPerformanceDetailRevenuebyPriceChanges: {
        getUrl: "report/store/productPerformanceDetailRevenuebyPriceChanges",
        key: "get-productPerformanceDetailRevenuebyPriceChanges"
    },
    getProductPerformanceDetailTabaleView: {
        getUrl: "report/store/productPerformanceDetailTabaleView",
        key: "get-productPerformanceDetailTabaleView"
    },
    getRevenueChart: {
        getUrl: "dashboard/store/getRevenueChart",
        key: "get-revenueChart"
    },
    getIncomeExpenseChart: {
        getUrl: "dashboard/store/getIncomeExpenseChart",
        key: "get-incomeExpenseChart"
    },
    getSaleSummary: {
        getUrl: "dashboard/store/getSaleSummary",
        key: "get-saleSummary"
    },
    getCurrentVariantAttribute: {
        getUrl: "attribute/store/getCurrentVariantAttribute",
        key: "get-currentVariantAttribute"
    },
    postAddCustomAttributeValue: {
        getUrl: "attribute/store/addCustomAttributeValue",
        key: "post-addCustomAttributeValue"
    },
    getSinglePurchaseInvoice: {
        getUrl: "purchaseInvoice/store/getSinglePurchaseInvoice",
        key: "get-singlePurchaseInvoice"
    },
    putEditPurchaseInvoice: {
        getUrl: "purchaseInvoice/store/editPurchaseInvoice",
        key: "put-editPurchaseInvoice"
    },
    patchUpdateProductStatus: {
        getUrl: "product/store/updateProductStatus",
        key: "patch-updateProductStatus"
    },
    getTopProducts: {
        getUrl: "dashboard/store/topProducts",
        key: "get-topProducts"
    },
    getTicketCategoryList: {
        getUrl: "ticketCategory/ticketCategoryList",
        key: "get-ticketCategoryList"
    },
    postTicketCreate: {
        getUrl: "ticket/ticketCreate",
        key: "post-ticketCreate"
    },
    getTicketListStorewise: {
        getUrl: "ticket/ticketListStorewise",
        key: "get-ticketListStorewise"
    },
    getAllCollections: {
        getUrl: "collection/getAllCollections",
        key: "get-allCollections"
    },
    postCreateCollection: {
        getUrl: "collection/createCollection",
        key: "post-createCollection"
    },
    putUpdateCollection: {
        getUrl: "collection/updateCollection",
        key: "put-updateCollection"
    },
    getCollectionById: {
        getUrl: "collection/getCollectionById",
        key: "get-collectionById"
    },
    getStoreThems: {
        getUrl: "StoreTheme/getStoreThems",
        key: "get-storeThems"
    },
    postSetStoreThems: {
        getUrl: "StoreTheme/SetStoreThems",
        key: "post-setStoreThems"
    },
}