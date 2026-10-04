import Supplier from "../models/Supplier.js";

const addSupplier = async (req, res) => {
  try {
    const { supplierName, company, supplierEmail, supplierPhone, supplierAddress } = req.body;

    if (!supplierName || !company || !supplierEmail || !supplierPhone || !supplierAddress) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingSupplier = await Supplier.findOne({ where: { supplierName } });
    if (existingSupplier) {
      return res.status(400).json({
        success: false,
        message: "Supplier already exists",
      });
    }

    await Supplier.create({
      supplierName,
      company,
      supplierEmail,
      supplierPhone,
      supplierAddress,
    });

    return res.status(201).json({
      success: true,
      message: "Supplier added successfully",
    });
  } catch (error) {
    console.log("Error adding Supplier:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findAll();
    return res.status(200).json({ success: true, supplier });
  } catch (error) {
    console.error('Error fetching Supplier:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierName, company, supplierEmail, supplierPhone, supplierAddress } = req.body;

    const existingSupplier = await Supplier.findByPk(id);
    if (!existingSupplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    await existingSupplier.update({
      supplierName,
      company,
      supplierEmail,
      supplierPhone,
      supplierAddress,
    });

    return res.status(200).json({ success: true, message: 'Supplier updated successfully' });
  } catch (error) {
    console.error('Error updating supplier:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSupplier = await Supplier.findByPk(id);
    if (!existingSupplier) {
      return res.status(404).json({ success: false, message: 'Supplier not found' });
    }

    await existingSupplier.destroy();
    return res.status(200).json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { addSupplier, getSupplier, updateSupplier, deleteSupplier };
