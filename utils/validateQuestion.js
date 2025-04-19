const keywords = ["moto", "cilindraje", "marca", "modelo", "precio", "transmisión", "freno", "peso"];

const validateQuestion = (question) => {
    if (!question) return false;

    // Convertir la pregunta a minúsculas y verificar si contiene alguna palabra clave
    const lowerCaseQuestion = question.toLowerCase();
    return keywords.some((keyword) => lowerCaseQuestion.includes(keyword));
};

module.exports = validateQuestion;