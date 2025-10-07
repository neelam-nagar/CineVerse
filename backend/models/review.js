import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tmdb_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.TINYINT,
        allowNull: false,
        validate: { min: 1, max: 10},
    },
    review_text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    movie_title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    poster_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sentiment: {
        type: DataTypes.DECIMAL(3,2),
        allowNull: true,
    },
    fake: {
        type: DataTypes.DECIMAL(3,2),
        allowNull: true,
    },
    biased: {
        type: DataTypes.DECIMAL(3,2),
        allowNull: true,
    },
}, 
{
    timestamps: true,
});

// Define associations
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

export default Review;
