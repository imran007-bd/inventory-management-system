import React, { useState, useEffect, useMemo } from "react";
import Container from "../Container";
import { Button } from "../ui/button";
import { MdOutlineCancel } from "react-icons/md";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";

const emptySupplierForm = {
  supplierName: "",
  company: "",
  supplierEmail: "",
  supplierPhone: "",
  supplierAddress: "",
};

const todayDate = () => new Date().toISOString().slice(0, 10);

const emptyOrderForm = () => ({
  itemName: "",
  categoryId: "",
  purchaseDate: todayDate(),
  quantity: "",
  cost: "",
  paymentStatus: "Unpaid",
});

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
  },
});

const Suppliers = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [addEditModel, setAddEditModel] = useState(null);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formdata, setFormData] = useState(emptySupplierForm);

  const [ordersModel, setOrdersModel] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [orderForm, setOrderForm] = useState(emptyOrderForm());

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/supplier",
        authHeaders()
      );
      setSuppliers(response.data.supplier);
    } catch (error) {
      console.error("Error fetching Suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/product",
        authHeaders()
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/category",
        authHeaders()
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching Categories:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(
      (s) =>
        s.supplierName.toLowerCase().includes(search.toLowerCase()) ||
        s.company?.toLowerCase().includes(search.toLowerCase())
    );
  }, [suppliers, search]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setEditSupplier(null);
    setFormData(emptySupplierForm);
    setAddEditModel(1);
  };

  const handleEditClick = (supplier) => {
    setEditSupplier(supplier.id);
    setFormData({
      supplierName: supplier.supplierName,
      company: supplier.company || "",
      supplierEmail: supplier.supplierEmail,
      supplierPhone: supplier.supplierPhone,
      supplierAddress: supplier.supplierAddress,
    });
    setAddEditModel(1);
  };

  const handleCloseModal = () => {
    setAddEditModel(null);
    setEditSupplier(null);
    setFormData(emptySupplierForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = editSupplier
        ? await axios.put(
            `http://localhost:3000/api/supplier/${editSupplier}`,
            formdata,
            authHeaders()
          )
        : await axios.post(
            "http://localhost:3000/api/supplier/add",
            formdata,
            authHeaders()
          );

      if (response.data.success) {
        alert(editSupplier ? "Supplier updated successfully" : "Supplier added successfully");
        handleCloseModal();
        fetchSuppliers();
      }
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert(error.response?.data?.message || "Error saving supplier.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/supplier/${id}`,
        authHeaders()
      );
      if (response.data.success) {
        alert("Supplier deleted successfully!");
        fetchSuppliers();
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert(error.response?.data?.message || "Error deleting supplier.");
    }
  };

  const fetchOrders = async (supplierId) => {
    setOrdersLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/purchase-order?supplierId=${supplierId}`,
        authHeaders()
      );
      setOrders(response.data.purchaseOrders);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleViewOrders = (supplier) => {
    setOrdersModel(supplier);
    setEditOrder(null);
    setOrderForm(emptyOrderForm());
    fetchOrders(supplier.id);
  };

  const handleCloseOrders = () => {
    setOrdersModel(null);
    setOrders([]);
    setEditOrder(null);
    setOrderForm(emptyOrderForm());
  };

  const handleOrderForm = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditOrderClick = (order) => {
    setEditOrder(order.id);
    setOrderForm({
      itemName: order.itemName,
      categoryId: String(order.categoryId),
      purchaseDate: order.purchaseDate,
      quantity: order.quantity,
      cost: order.cost,
      paymentStatus: order.paymentStatus,
    });
  };

  const handleCancelOrderEdit = () => {
    setEditOrder(null);
    setOrderForm(emptyOrderForm());
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!ordersModel) return;
    try {
      const payload = {
        ...orderForm,
        supplierId: ordersModel.id,
        categoryId: parseInt(orderForm.categoryId, 10),
        quantity: parseInt(orderForm.quantity, 10),
        cost: parseFloat(orderForm.cost),
      };

      const response = editOrder
        ? await axios.put(
            `http://localhost:3000/api/purchase-order/${editOrder}`,
            payload,
            authHeaders()
          )
        : await axios.post(
            "http://localhost:3000/api/purchase-order/add",
            payload,
            authHeaders()
          );

      if (response.data.success) {
        setEditOrder(null);
        setOrderForm(emptyOrderForm());
        fetchOrders(ordersModel.id);
      }
    } catch (error) {
      console.error("Error saving purchase order:", error);
      alert(error.response?.data?.message || "Error saving purchase order.");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase order?")) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/purchase-order/${id}`,
        authHeaders()
      );
      if (response.data.success) {
        fetchOrders(ordersModel.id);
      }
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      alert(error.response?.data?.message || "Error deleting purchase order.");
    }
  };

  return (
    <Container>
      <h2 className="font-bold text-[#0C2B4E] text-4xl">Supplier Management</h2>
      <div className="flex justify-between py-5">
        <input
          type="text"
          placeholder="Search by supplier or company"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[400px] rounded-xl border-[#0C2B4E] border-2 py-3 px-2"
        />
        <Button
          type="button"
          className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
          onClick={handleAddClick}
        >
          Add Supplier
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 ">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Supplier Name</th>
              <th className="border border-gray-300 p-2">Company</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Phone</th>
              <th className="border border-gray-300 p-2">Address</th>
              <th className="border border-gray-300 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td className="border border-gray-300 p-2">{supplier.supplierName}</td>
                <td className="border border-gray-300 p-2">{supplier.company}</td>
                <td className="border border-gray-300 p-2">{supplier.supplierEmail}</td>
                <td className="border border-gray-300 p-2">{supplier.supplierPhone}</td>
                <td className="border border-gray-300 p-2">{supplier.supplierAddress}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
                      onClick={() => handleViewOrders(supplier)}
                    >
                      Previous Orders
                    </Button>
                    <Button
                      className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
                      onClick={() => handleEditClick(supplier)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-[#0C2B4E] hover:bg-red-700 duration-300"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={6} className="border border-gray-300 p-4 text-center">
                  No suppliers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {addEditModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="gap-4 mt-4 bg-white p-4 rounded w-[800px] relative">
            <button
              className="absolute top-1 right-1 text-xl cursor-pointer hover:text-red-700"
              onClick={handleCloseModal}
            >
              <MdOutlineCancel />
            </button>
            <form
              className="flex flex-col gap-4 mt-2 bg-white p-4 rounded shadow-md"
              onSubmit={handleSubmit}
            >
              <h2 className="font-bold text-[#0C2B4E] text-3xl">
                {editSupplier ? "Edit Supplier" : "Add Supplier"}
              </h2>
              <FieldSet>
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="supplierName">Supplier Name</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="supplierName"
                      type="text"
                      placeholder="ex: John Doe"
                      name="supplierName"
                      value={formdata.supplierName}
                      onChange={handleForm}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="company">Company</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="company"
                      type="text"
                      placeholder="ex: Acme Textiles"
                      name="company"
                      value={formdata.company}
                      onChange={handleForm}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplierEmail">Email</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="supplierEmail"
                      type="email"
                      placeholder="ex: johndoe@gmail.com"
                      name="supplierEmail"
                      value={formdata.supplierEmail}
                      onChange={handleForm}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="supplierPhone">Phone</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="supplierPhone"
                      type="text"
                      placeholder="01*********"
                      name="supplierPhone"
                      value={formdata.supplierPhone}
                      onChange={handleForm}
                    />
                  </Field>
                  <Field className="col-span-2">
                    <FieldLabel htmlFor="supplierAddress">Address</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="supplierAddress"
                      type="text"
                      placeholder="Address"
                      name="supplierAddress"
                      value={formdata.supplierAddress}
                      onChange={handleForm}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Button
                type="submit"
                className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
              >
                {editSupplier ? "Save Changes" : "Add Supplier"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {ordersModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center overflow-y-auto py-6">
          <div className="gap-4 mt-4 bg-white p-4 rounded w-[900px] relative">
            <button
              className="absolute top-1 right-1 text-xl cursor-pointer hover:text-red-700"
              onClick={handleCloseOrders}
            >
              <MdOutlineCancel />
            </button>
            <h2 className="font-bold text-[#0C2B4E] text-3xl mb-2">
              Previous Orders — {ordersModel.supplierName}
            </h2>

            {ordersLoading ? (
              <div>Loading...</div>
            ) : (
              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Purchase ID</th>
                    <th className="border border-gray-300 p-2">Item</th>
                    <th className="border border-gray-300 p-2">Category</th>
                    <th className="border border-gray-300 p-2">Purchase Date</th>
                    <th className="border border-gray-300 p-2">Quantity</th>
                    <th className="border border-gray-300 p-2">Cost</th>
                    <th className="border border-gray-300 p-2">Payment Status</th>
                    <th className="border border-gray-300 p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="border border-gray-300 p-2">{order.id}</td>
                      <td className="border border-gray-300 p-2">{order.itemName}</td>
                      <td className="border border-gray-300 p-2">{order.category?.categoryName}</td>
                      <td className="border border-gray-300 p-2">{order.purchaseDate}</td>
                      <td className="border border-gray-300 p-2">{order.quantity}</td>
                      <td className="border border-gray-300 p-2">{order.cost}</td>
                      <td className="border border-gray-300 p-2">{order.paymentStatus}</td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex justify-center items-center gap-2">
                          <Button
                            className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
                            onClick={() => handleEditOrderClick(order)}
                          >
                            Edit
                          </Button>
                          <Button
                            className="bg-[#0C2B4E] hover:bg-red-700 duration-300"
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="border border-gray-300 p-4 text-center">
                        No purchase orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            <form
              className="flex flex-col gap-4 bg-white p-4 rounded shadow-md border"
              onSubmit={handleOrderSubmit}
            >
              <h3 className="font-bold text-[#0C2B4E] text-xl">
                {editOrder ? "Edit Order" : "Add Order"}
              </h3>
              <FieldSet>
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="itemName">Item</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="itemName"
                      type="text"
                      list="item-suggestions"
                      placeholder="ex: Classic Cotton Shirt"
                      name="itemName"
                      value={orderForm.itemName}
                      onChange={handleOrderForm}
                    />
                    <datalist id="item-suggestions">
                      {products.map((product) => (
                        <option key={product.id} value={product.productName} />
                      ))}
                    </datalist>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                    <select
                      className="border p-1 bg-white rounded px-4 h-9"
                      id="categoryId"
                      name="categoryId"
                      value={orderForm.categoryId}
                      onChange={handleOrderForm}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={String(category.id)}>
                          {category.categoryName}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="purchaseDate">Purchase Date</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="purchaseDate"
                      type="date"
                      name="purchaseDate"
                      value={orderForm.purchaseDate}
                      onChange={handleOrderForm}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="quantity"
                      type="number"
                      min="0"
                      placeholder="ex: 50"
                      name="quantity"
                      value={orderForm.quantity}
                      onChange={handleOrderForm}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="cost">Cost</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="cost"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="ex: 250.00"
                      name="cost"
                      value={orderForm.cost}
                      onChange={handleOrderForm}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paymentStatus">Payment Status</FieldLabel>
                    <select
                      className="border p-1 bg-white rounded px-4 h-9"
                      id="paymentStatus"
                      name="paymentStatus"
                      value={orderForm.paymentStatus}
                      onChange={handleOrderForm}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
                >
                  {editOrder ? "Save Changes" : "Add Order"}
                </Button>
                {editOrder && (
                  <Button
                    type="button"
                    className="bg-[#0C2B4E] hover:bg-red-700 duration-300"
                    onClick={handleCancelOrderEdit}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Suppliers;
