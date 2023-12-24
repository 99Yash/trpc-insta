import { createNextRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
import { env } from "@/env.mjs";
 
// Export routes for Next App Router
export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
	config:{
		uploadthingId:env.UPLOADTHING_APP_ID,
		uploadthingSecret:env.UPLOADTHING_SECRET	
	}
});