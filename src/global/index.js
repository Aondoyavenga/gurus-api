import express from 'express'
import mongoose from "mongoose";
const { model, Schema } = mongoose

export const GLOBAL = {
    model,
    Schema,
    express,
    mongoose
}