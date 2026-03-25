import { createDeepgramConnection } from "./src/modules/transcript/transcript.service";
import dotenv from "dotenv";

dotenv.config();

process.env.DEEPGRAM_API_KEY = "dummy_key_for_testing";

try {
    const dgConnection = createDeepgramConnection();
    console.log("Success: createDeepgramConnection returned successfully");
    
    // Test if 'on' is available
    dgConnection.on("open", () => {
        console.log("Mock open event");
    });

    // Test send method (which is added in .then())
    // Since it's async inside, we check later.
    setTimeout(() => {
        if (typeof (dgConnection as any).send === "function") {
            console.log("Success: send method is available after async setup");
            process.exit(0);
        } else {
            console.error("Error: send method still NOT available after 2 seconds");
            process.exit(1);
        }
    }, 2000);

} catch (error) {
    console.error("Failed to create connection:", error);
    process.exit(1);
}
