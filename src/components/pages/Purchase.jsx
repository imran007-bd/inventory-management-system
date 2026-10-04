import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
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

const todayDate = () => new Date().toISOString().slice(0, 10);

const emptyForm = () => ({
  supplierId: "",
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

const Purchase = () => {
  const [loading, setLoading] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [supplierFilter, setSupplierFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const [addEditModel, setAddEditModel] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [formdata, setFormData] = useState(emptyForm());

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/purchase-order",
        authHeaders()
      );
      setPurchaseOrders(response.data.purchaseOrders);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/supplier",
        authHeaders()
      );
      setSuppliers(response.data.supplier);
    } catch (error) {
      console.error("Error fetching Suppliers:", error);
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
    fetchPurchaseOrders();
    fetchSuppliers();
    fetchProducts();
    fetchCategories();
  }, []);

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((order) => {
      const matchesSupplier =
        !supplierFilter || String(order.supplierId) === supplierFilter;
      const matchesPaymentStatus =
        !paymentStatusFilter || order.paymentStatus === paymentStatusFilter;
      return matchesSupplier && matchesPaymentStatus;
    });
  }, [purchaseOrders, supplierFilter, paymentStatusFilter]);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setEditOrder(null);
    setFormData(emptyForm());
    setAddEditModel(1);
  };

  const handleEditClick = (order) => {
    setEditOrder(order.id);
    setFormData({
      supplierId: String(order.supplierId),
      itemName: order.itemName,
      categoryId: String(order.categoryId),
      purchaseDate: order.purchaseDate,
      quantity: order.quantity,
      cost: order.cost,
      paymentStatus: order.paymentStatus,
    });
    setAddEditModel(1);
  };

  const handleCloseModal = () => {
    setAddEditModel(null);
    setEditOrder(null);
    setFormData(emptyForm());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formdata,
        supplierId: parseInt(formdata.supplierId, 10),
        categoryId: parseInt(formdata.categoryId, 10),
        quantity: parseInt(formdata.quantity, 10),
        cost: parseFloat(formdata.cost),
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
        alert(editOrder ? "Purchase order updated successfully" : "Purchase order added successfully");
        handleCloseModal();
        fetchPurchaseOrders();
      }
    } catch (error) {
      console.error("Error saving purchase order:", error);
      alert(error.response?.data?.message || "Error saving purchase order.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase order?")) return;
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/purchase-order/${id}`,
        authHeaders()
      );
      if (response.data.success) {
        alert("Purchase order deleted successfully!");
        fetchPurchaseOrders();
      }
    } catch (error) {
      console.error("Error deleting purchase order:", error);
      alert(error.response?.data?.message || "Error deleting purchase order.");
    }
  };

  return (
    <Container>
      <h2 className="font-bold text-[#0C2B4E] text-4xl">Purchase Management</h2>

      <div className="flex flex-wrap justify-between items-center gap-3 py-5">
        <div className="flex flex-wrap gap-3">
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
            className="rounded-xl border-[#0C2B4E] border-2 py-3 px-2"
          >
            <option value="">All Suppliers</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={String(supplier.id)}>
                {supplier.supplierName}
              </option>
            ))}
          </select>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="rounded-xl border-[#0C2B4E] border-2 py-3 px-2"
          >
            <option value="">All Payment Statuses</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <Button
          type="button"
          className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
          onClick={handleAddClick}
        >
          Add Purchase
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Purchase ID</th>
              <th className="border border-gray-300 p-2">Supplier</th>
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
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 p-2">{order.id}</td>
                <td className="border border-gray-300 p-2">{order.supplier?.supplierName}</td>
                <td className="border border-gray-300 p-2">{order.itemName}</td>
                <td className="border border-gray-300 p-2">{order.category?.categoryName}</td>
                <td className="border border-gray-300 p-2">{order.purchaseDate}</td>
                <td className="border border-gray-300 p-2">{order.quantity}</td>
                <td className="border border-gray-300 p-2">{order.cost}</td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700"
                        : order.paymentStatus === "Partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
                      onClick={() => handleEditClick(order)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-[#0C2B4E] hover:bg-red-700 duration-300"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={9} className="border border-gray-300 p-4 text-center">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {addEditModel && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center overflow-y-auto py-6">
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
                {editOrder ? "Edit Purchase" : "Add Purchase"}
              </h2>
              <FieldSet>
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="supplierId">Supplier</FieldLabel>
                    <select
                      className="border p-1 bg-white rounded px-4 h-9"
                      id="supplierId"
                      name="supplierId"
                      value={formdata.supplierId}
                      onChange={handleForm}
                    >
                      <option value="">Select a supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={String(supplier.id)}>
                          {supplier.supplierName}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="itemName">Item</FieldLabel>
                    <Input
                      className="border p-1 bg-white rounded px-4"
                      id="itemName"
                      type="text"
                      list="item-suggestions"
                      placeholder="ex: Classic Cotton Shirt"
                      name="itemName"
                      value={formdata.itemName}
                      onChange={handleForm}
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
                      value={formdata.categoryId}
                      onChange={handleForm}
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
                      value={formdata.purchaseDate}
                      onChange={handleForm}
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
                      value={formdata.quantity}
                      onChange={handleForm}
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
                      value={formdata.cost}
                      onChange={handleForm}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="paymentStatus">Payment Status</FieldLabel>
                    <select
                      className="border p-1 bg-white rounded px-4 h-9"
                      id="paymentStatus"
                      name="paymentStatus"
                      value={formdata.paymentStatus}
                      onChange={handleForm}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </Field>
                </FieldGroup>
              </FieldSet>
              <Button
                type="submit"
                className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
              >
                {editOrder ? "Save Changes" : "Add Purchase"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Purchase;
