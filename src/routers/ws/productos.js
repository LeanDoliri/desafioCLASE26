import productosApi from "../../api/productos.js";
import addRandomProducts from "../../mocks/fakerProducts.js";

async function addProductsFaker() {
  for (let i = 0; i < 5; i++) {
    await productosApi.guardar(addRandomProducts());
  }
  const productos = await productosApi.listarAll();
  socket.emit("productos", productos);
}

export default async function configurarSocket(socket) {
  // ---- PRODUCTOS ----
  // carga inicial de productos
  const productos = await productosApi.listarAll();
  if (productos.length == 0) {
    await addProductsFaker();
  } else {
    socket.emit("productos", productos);
  }

  // actualizacion de productos
  socket.on("newProduct", async (data) => {
    productosApi.guardar(data);
    const productos = await productosApi.listarAll();
    io.sockets.emit("productos", productos);
  });
}
