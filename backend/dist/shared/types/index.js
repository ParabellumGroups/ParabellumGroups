"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.ProductType = exports.ExpenseStatus = exports.InvoiceStatus = exports.QuoteStatus = exports.CustomerType = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["GENERAL_DIRECTOR"] = "GENERAL_DIRECTOR";
    UserRole["SERVICE_MANAGER"] = "SERVICE_MANAGER";
    UserRole["EMPLOYEE"] = "EMPLOYEE";
    UserRole["ACCOUNTANT"] = "ACCOUNTANT";
})(UserRole || (exports.UserRole = UserRole = {}));
var CustomerType;
(function (CustomerType) {
    CustomerType["INDIVIDUAL"] = "INDIVIDUAL";
    CustomerType["COMPANY"] = "COMPANY";
})(CustomerType || (exports.CustomerType = CustomerType = {}));
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["DRAFT"] = "DRAFT";
    QuoteStatus["SUBMITTED_FOR_SERVICE_APPROVAL"] = "SUBMITTED_FOR_SERVICE_APPROVAL";
    QuoteStatus["APPROVED_BY_SERVICE_MANAGER"] = "APPROVED_BY_SERVICE_MANAGER";
    QuoteStatus["REJECTED_BY_SERVICE_MANAGER"] = "REJECTED_BY_SERVICE_MANAGER";
    QuoteStatus["SUBMITTED_FOR_DG_APPROVAL"] = "SUBMITTED_FOR_DG_APPROVAL";
    QuoteStatus["APPROVED_BY_DG"] = "APPROVED_BY_DG";
    QuoteStatus["REJECTED_BY_DG"] = "REJECTED_BY_DG";
    QuoteStatus["ACCEPTED_BY_CLIENT"] = "ACCEPTED_BY_CLIENT";
    QuoteStatus["REJECTED_BY_CLIENT"] = "REJECTED_BY_CLIENT";
    QuoteStatus["EXPIRED"] = "EXPIRED";
})(QuoteStatus || (exports.QuoteStatus = QuoteStatus = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "DRAFT";
    InvoiceStatus["SENT"] = "SENT";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["PARTIAL"] = "PARTIAL";
    InvoiceStatus["OVERDUE"] = "OVERDUE";
    InvoiceStatus["CANCELLED"] = "CANCELLED";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
var ExpenseStatus;
(function (ExpenseStatus) {
    ExpenseStatus["PENDING"] = "PENDING";
    ExpenseStatus["PAID"] = "PAID";
    ExpenseStatus["REIMBURSED"] = "REIMBURSED";
})(ExpenseStatus || (exports.ExpenseStatus = ExpenseStatus = {}));
var ProductType;
(function (ProductType) {
    ProductType["PRODUCT"] = "PRODUCT";
    ProductType["SERVICE"] = "SERVICE";
    ProductType["SUBSCRIPTION"] = "SUBSCRIPTION";
})(ProductType || (exports.ProductType = ProductType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["TRANSFER"] = "TRANSFER";
    PaymentMethod["CHECK"] = "CHECK";
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["OTHER"] = "OTHER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
//# sourceMappingURL=index.js.map