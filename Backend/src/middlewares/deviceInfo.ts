import type { Request } from "express";
import type { DeviceInfo } from "../types";

export const extractDeviceInfo = (req: Request): DeviceInfo => {
  const userAgent = req.headers["user-agent"] || "Unknown";
  const ipAddress = req.ip || req.socket.remoteAddress || "Unknown";

  let deviceName = "Unknown Device";
  if (userAgent.includes("Chrome")) deviceName = "Chrome";
  else if (userAgent.includes("Firefox")) deviceName = "Firefox";
  else if (userAgent.includes("Safari")) deviceName = "Safari";
  else if (userAgent.includes("Edge")) deviceName = "Edge";
  else if (userAgent.includes("Mobile")) deviceName = "Mobile Device";
  else if (userAgent.includes("Postman")) deviceName = "Postman";

  const deviceId = Buffer.from(`${ipAddress}-${userAgent}`)
    .toString("base64")
    .substring(0, 50);

  return {
    deviceName,
    ipAddress,
    userAgent,
    deviceId,
  };
};
