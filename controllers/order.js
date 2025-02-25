const Order = require("../models/order");
const { jsPDF } = require("jspdf");

// Todo :

/*
1- Add Order
2- Delete Order
3- Update Order
4- Search For Order With Mobile Number 
5- Increase The Number Of Product
*/

// To Add Order :

exports.addOrder = async (req, res) => {
  try {
    const {
      customerName,
      mobileNum,
      status,
      orderStatus,
      address,
      product,
      price,
    } = req.body;

    const order = new Order({
      customerName,
      mobileNum,
      status,
      orderStatus,
      address,
      product,
      price,
    });

    await order.save();

    res.status(201).send({ message: "Order Added Successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// To Increase The Number Of Product In Order :

exports.numberOfProduct = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).send("No Orders Found");

    order.number += 1;

    await order.save();

    res.send(order);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// To Delete Order :

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("Attempting to delete order:", orderId);

    // استخدام findByIdAndDelete للتأكد من الحذف من قاعدة البيانات
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      console.log("Order not found for deletion");
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    console.log("Order deleted successfully:", deletedOrder);
    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      deletedOrder,
    });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message,
    });
  }
};

// To Search For Order :

exports.search = async (req, res) => {
  try {
    const { mobileNum } = req.query;

    if (!mobileNum) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const order = await Order.findOne({ mobileNum });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// To Update Order :

// exports.update = async (req, res) => {
//   try {
//     const {
//       customerName,
//       mobileNum,
//       status,
//       orderStatus,
//       address,
//       product,
//       price,
//     } = req.body;

//     const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!order) return res.status(404).send({ error: "order Not Found" });

//     res.send({ message: "order Updated Successfully", order });
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// إضافة دالة جديدة للحصول على كل الطلبات
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// To update By Id :

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // تحديث الطلب باستخدام findByIdAndUpdate
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // إرجاع الطلب المحدث
    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

// To get By Id :

exports.getById = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// To Delete All Orders
exports.deleteAllOrders = async (req, res) => {
  try {
    // حذف جميع الطلبات من قاعدة البيانات
    await Order.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All orders deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAllOrders:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting all orders",
      error: error.message,
    });
  }
};

// To print :

exports.print = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // Set headers for PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=orders.pdf");

    // Create PDF document
    const doc = new jsPDF();

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Orders Report", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    // Set up table
    const headers = [["#", "Customer", "Mobile", "Product", "Price", "Status"]];
    const data = orders.map((order, index) => [
      index + 1,
      order.customerName,
      order.mobileNum,
      order.product,
      order.price,
      order.status,
    ]);

    // Add table
    doc.autoTable({
      head: headers,
      body: data,
      startY: 30,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Convert PDF to buffer and send
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({
      success: false,
      message: "Error generating PDF",
      error: error.message,
    });
  }
};
