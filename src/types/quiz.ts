export interface Quiz {
    quizId: string;
    title: string;
    questions: Question[];
  }
  
  export interface Question {
    id: string;
    text: string;
    options: string[];
    answerIndex: number;
  }
  