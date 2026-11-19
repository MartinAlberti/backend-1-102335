import mongoose from "mongoose";
import { servicesService } from "../config/dependencies.js";

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

const renderServices = async (req, res) => {
  try {
    const servicePlain = await servicesService.getServices();
    console.log(servicePlain);
    const services = plain(servicePlain);
    res.render("services", { title: "Servicios", services });
  } catch (error) {}
};

const renderServiceDetail = async (req, res) => {
  const { sid } = req.params;
  if (!mongoose.isObjectIdOrHexString(sid)) {
    return res.status(400); // completar
  }
  try {
    const service = await servicesService.getServiceById(sid);
    if (!service) return res.status(404); //completar
    res.render("service-detail", {
      title: "Detalle del servicio",
      service: plain(service),
    });
  } catch (error) {}
};

export { renderServices, renderServiceDetail };
