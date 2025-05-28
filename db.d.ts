import { Connection } from "mongoose"

declare global{
  conn: Connection || null;
  promise: Promise<Connection> || null
}