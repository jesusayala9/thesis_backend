const { getUserById, updateUserProfileImage } = require('../services/get-users');

exports.getUserProfile = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
    }
};

exports.updateUserProfileImage = async (req, res) => {
    const userId = req.params.id;
    const { profileImage } = req.body;

    try {
        const user = await updateUserProfileImage(userId, profileImage);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar la imagen de perfil' });
    }
};