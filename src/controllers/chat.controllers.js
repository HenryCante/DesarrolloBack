import { poolPromise } from "../config/db.js";

//export const getChatMensajes = async (req, res, next) => {
  //try {
    //const pool = await poolPromise;
    
    //const result = await pool.request()
      //.query(`SELECT Id, Cod_Sala, Login_Emisor, Contenido, FechaHora
              //FROM dbo.Chat_Mensaje
              //ORDER BY FechaHora ASC`);

    //res.json({ success: true, data: result.recordset });
  //} catch (err) {
    //next(err);
  //}
//};
export const getChatMensajes = async (req, res, next) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`SELECT 
                ID_Mensaje, 
                Cod_Sala, 
                Login_Emisor, 
                Contenido, 
                Fecha_Envio,
                Estado
              FROM dbo.Chat_Mensaje
              ORDER BY Fecha_Envio ASC`);

    res.json({ success: true, data: result.recordset });
  } catch (err) {
    next(err);
  }
};