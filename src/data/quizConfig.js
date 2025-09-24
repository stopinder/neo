import { questions as defaultQuestions } from "./questions.js"
import { enneagramQuestions } from "./enneagramQuestions.js"

export const quizConfig = {
    default: {
        title: "Elements Quiz",
        description: "Discover which element fits you best.",
        questions: defaultQuestions,
    },
    enneagram: {
        title: "Enneagram Quiz",
        description: "Find your Enneagram type.",
        questions: enneagramQuestions,
    },
    // 👇 just add more here later
    // ifs: {
    //   title: "IFS Quiz",
    //   description: "Explore your internal parts.",
    //   questions: ifsQuestions,
    // },
}
