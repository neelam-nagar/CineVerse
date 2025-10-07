// models/user.model.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // <-- your Sequelize instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100], // password must be at least 6 chars
      },
    },
    profilePic: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

export default User;
