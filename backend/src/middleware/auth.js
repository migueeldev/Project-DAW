const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    // 1. Obtener el token del header Authorization
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'Acceso denegado. No se proporcionó token de autenticación.' 
      });
    }

    // 2. El token viene como "Bearer TOKEN", extraemos solo el TOKEN
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Formato de token inválido.' 
      });
    }

    // 3. Verificar que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Guardar la información del usuario en req.user
    req.user = decoded; // { id, email, nombre }
    
    // 5. Continuar con la siguiente función
    next();
    
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expirado. Por favor, inicia sesión nuevamente.' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Token inválido.' 
    });
  }
};

module.exports = { verificarToken };