import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "../Container";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      console.log(response.data.categories);
      setCategories(response.data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCategory) {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/category/${editCategory}`,
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          setEditCategory(null);
          setCategoryName("");
          setCategoryDescription("");
          alert("Category updated successfully");
          fetchCategories();
        }
      } catch (error) {
        console.error("Error adding category:", error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert("Error adding category.");
        }
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/category/add",
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          alert("Category added successfully");
          setCategoryName("");
          setCategoryDescription("");

          fetchCategories();
        }
      } catch (error) {
        console.error("Error adding category:", error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        } else {
          alert("Error adding category.");
        }
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/category/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          alert("Category deleted successfully!");
          fetchCategories(); // Refresh the categories list after deletion
        } else {
          console.error("Error deleting category:", data);
          alert("Error deleting category. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category. Please try again.");
      }
    }
  };

  if (loading) return <div className="text-xl text-[#0C2B4E]">Loading....</div>;

  const handleEdit = async (category) => {
    setEditCategory(category.id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleCancel = async () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  return (
    <Container>
      <div className="flex justify-between">
        <div className="lg:w-1/3">
          <h2 className="font-bold text-[#0C2B4E] text-4xl">
            {editCategory ? "Edit Category" : "Add Category"}
          </h2>
          <form className="w-2/3 py-3" onSubmit={handleSubmit}>
            <FieldSet>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="categoryName">Category Name</FieldLabel>
                  <Input
                    id="categoryName"
                    type="text"
                    placeholder="ex:Shirt"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="categoryDescription">
                    Category Description
                  </FieldLabel>
                  <Input
                    id="categoryDescription"
                    type="text"
                    placeholder="Description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                  />
                </Field>
              </FieldGroup>
              <div>
                <Button
                  type="submit"
                  className="w-full bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
                >
                  {editCategory ? "Save Changes" : "Add Category"}
                </Button>
                {editCategory && (
                  <Button
                    type="button"
                    className="mt-3 w-full bg-[#0C2B4E] hover:bg-red-700 duration-300"
                    onClick={handleCancel}
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>
            </FieldSet>
          </form>
        </div>
        <div className="lg:w-2/3 py-9">
          <table className="w-full border-collapse border border-gray-300 ">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">No:</th>
                <th className="border border-gray-300 p-2">Category Name</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* This map function will now work because categories is an array */}
              {categories.map((category, index) => (
                <tr key={category.id}>
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    {category.categoryName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {category.categoryDescription}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <div className="flex justify-center items-center gap-2">
                      <Button
                        className="bg-[#0C2B4E] hover:bg-[#45BA8C] duration-300"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="bg-[#0C2B4E] hover:bg-red-700 duration-300"
                        onClick={() => handleDelete(category.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
};

export default Categories;
