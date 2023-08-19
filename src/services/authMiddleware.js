export const authorizeAdmin = (request, response, next) => {
  const user = request.session.user;
  if(user && user.role === 'admin') {
    next();
  } else {
    response.status(403).json({message:'Acceso denegado'})
  }
};

export const authorizeUser = (request, response, next) => {
  const user = request.session.user;
  if (user && user.role === 'user') {
    next();
  } else {
    response.status(403).json({ message: 'Acceso denegado'})
  }
};

export const authorizePremium = (request, response, next) => {
  const user = request.session.user;
  if (user && (user.role==='premium' || user.role === 'admin')) {
    next();
  } else {
    response.status(403).json({message: 'Acceso denegado'})
  }
}