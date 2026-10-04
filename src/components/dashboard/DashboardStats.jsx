import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const LOW_STOCK_THRESHOLD = 10;

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
  },
});

const StatCard = ({ label, value }) => (
  <Card className="border-[#0C2B4E]/10">
    <CardHeader>
      <CardTitle className="text-sm font-medium text-gray-500">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-bold text-[#0C2B4E]">{value}</p>
    </CardContent>
  </Card>
);

const DashboardStats = ({ scope = "full" }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        if (scope === "full") {
          const [productsRes, categoriesRes, suppliersRes, purchaseOrdersRes] = await Promise.all([
            axios.get("http://localhost:3000/api/product", authHeaders()),
            axios.get("http://localhost:3000/api/category", authHeaders()),
            axios.get("http://localhost:3000/api/supplier", authHeaders()),
            axios.get("http://localhost:3000/api/purchase-order", authHeaders()),
          ]);
          setProducts(productsRes.data.products);
          setCategories(categoriesRes.data.categories);
          setSuppliers(suppliersRes.data.supplier);
          setPurchaseOrders(purchaseOrdersRes.data.purchaseOrders);
        } else {
          const [productsRes, categoriesRes] = await Promise.all([
            axios.get("http://localhost:3000/api/product", authHeaders()),
            axios.get("http://localhost:3000/api/category", authHeaders()),
          ]);
          setProducts(productsRes.data.products);
          setCategories(categoriesRes.data.categories);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [scope]);

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.quantity <= LOW_STOCK_THRESHOLD),
    [products]
  );

  const inventoryValue = useMemo(
    () => products.reduce((sum, product) => sum + product.quantity * product.sellingPrice, 0),
    [products]
  );

  const pendingPaymentsTotal = useMemo(
    () =>
      purchaseOrders
        .filter((order) => order.paymentStatus !== "Paid")
        .reduce((sum, order) => sum + Number(order.cost), 0),
    [purchaseOrders]
  );

  const recentOrders = useMemo(() => purchaseOrders.slice(0, 5), [purchaseOrders]);

  const stats =
    scope === "full"
      ? [
          { label: "Total Products", value: products.length },
          { label: "Total Categories", value: categories.length },
          { label: "Total Suppliers", value: suppliers.length },
          { label: "Low Stock Products", value: lowStockProducts.length },
          { label: "Inventory Value", value: inventoryValue.toLocaleString() },
          { label: "Pending Payments", value: pendingPaymentsTotal.toLocaleString() },
        ]
      : [
          { label: "Total Products", value: products.length },
          { label: "Total Categories", value: categories.length },
          { label: "Low Stock Products", value: lowStockProducts.length },
        ];

  if (loading) {
    return <div className="mt-6">Loading...</div>;
  }

  const lowStockTable = (
    <div>
      <h2 className="font-bold text-[#0C2B4E] text-xl mb-2">Low Stock Products</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Product</th>
            <th className="border border-gray-300 p-2">Category</th>
            <th className="border border-gray-300 p-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {lowStockProducts.map((product) => (
            <tr key={product.id}>
              <td className="border border-gray-300 p-2">{product.productName}</td>
              <td className="border border-gray-300 p-2">{product.category?.categoryName}</td>
              <td className="border border-gray-300 p-2">{product.quantity}</td>
            </tr>
          ))}
          {lowStockProducts.length === 0 && (
            <tr>
              <td colSpan={3} className="border border-gray-300 p-4 text-center">
                No low stock products.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      {scope === "full" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {lowStockTable}

          <div>
            <h2 className="font-bold text-[#0C2B4E] text-xl mb-2">Recent Purchase Orders</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Item</th>
                  <th className="border border-gray-300 p-2">Supplier</th>
                  <th className="border border-gray-300 p-2">Date</th>
                  <th className="border border-gray-300 p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border border-gray-300 p-2">{order.itemName}</td>
                    <td className="border border-gray-300 p-2">{order.supplier?.supplierName}</td>
                    <td className="border border-gray-300 p-2">{order.purchaseDate}</td>
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
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-4 text-center">
                      No purchase orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="mt-6">{lowStockTable}</div>
      )}
    </>
  );
};

export default DashboardStats;
