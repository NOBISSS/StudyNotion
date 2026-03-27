import { Schema, Types, model } from "mongoose";
const wishlistSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    courseIds: [{ type: Types.ObjectId, ref: "Course" }],
    bundleIds: [{ type: Types.ObjectId, ref: "Bundle" }],
    notes: { type: String },
    status: { type: String, enum: ["active", "purchased"], default: "active" },
    priority: { type: Number, default: 0 },
}, { timestamps: true });
const Wishlist = model("Wishlist", wishlistSchema);
export default Wishlist;
//# sourceMappingURL=wishlistModel.js.map