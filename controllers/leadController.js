import Lead from "../models/Lead.js";
import Spa from "../models/Spa.js";

export const createLead = async (req, res, next) => {
  try {
    const { spaId, name, phone, services = [], message = "" } = req.body;
    if (!spaId || !name || !phone) {
      return res
        .status(400)
        .json({ message: "spaId, name, and phone are required" });
    }
    const spa = await Spa.findOne({ spaId });
    if (!spa || !spa.isActive) {
      return res.status(400).json({ message: "Spa not available" });
    }
    const lead = await Lead.create({
      spa: spa._id,
      spaId: spa.spaId,
      spaName: spa.spaName,
      name,
      phone,
      services,
      message,
    });
    spa.totalLeads += 1;
    await spa.save();
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (req, res, next) => {
  try {
    const { spaId, from, to } = req.query;
    const query = {};
    if (spaId) {
      query.spaId = spaId;
    }
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }
    const leads = await Lead.find(query).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

