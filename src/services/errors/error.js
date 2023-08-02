import EErros from "./EErros.js";

export default (error, req, res, next) => {
  console.log(error.cause);

  switch (error.code) {
    case EErros.GET_PRODUCTS_ERROR:
      res.status(500).send({ status: 'error', error: 'Error al obtener los productos' });
      break;

    case EErros.PRODUCT_NOT_FOUND:
      res.status(404).send({ status: 'error', error: 'Producto no encontrado' });
      break;

    case EErros.ADD_PRODUCT_ERROR:
      res.status(500).send({ status: 'error', error: 'Error al agregar el producto' });
      break;

    case EErros.UPDATE_PRODUCT_ERROR:
      res.status(500).send({ status: 'error', error: 'Error al actualizar el producto' });
      break;

    case EErros.DELETE_PRODUCT_ERROR:
      res.status(500).send({ status: 'error', error: 'Error al eliminar el producto' });
      break;

    default:
      res.send({ status: 'error', error: 'Unhandled error' });
      break;
  }
};