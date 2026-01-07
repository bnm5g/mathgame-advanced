import type { Question } from '../game/state';

export class QuestionLoader {
    private static readonly QUESTION_PATH = '/questions/calculus.json';

    private static readonly FALLBACK_QUESTIONS: Question[] = [
        {
            id: 'fallback_001',
            text: 'What is the derivative of x?',
            answers: ['1', '0', 'x', 'x^2'],
            correctIndex: 0,
            points: 5
        }
    ];

    /**
     * Loads questions from the static JSON file.
     * Returns fallback questions if the load fails.
     */
    static async loadQuestions(): Promise<Question[]> {
        try {
            const response = await fetch(this.QUESTION_PATH);
            if (!response.ok) {
                console.warn(`Failed to load questions from ${this.QUESTION_PATH}. Using fallbacks.`);
                return this.FALLBACK_QUESTIONS;
            }

            const data = await response.json();
            if (!data.questions || !Array.isArray(data.questions)) {
                throw new Error('Invalid question data format');
            }

            return data.questions;
        } catch (error) {
            console.error('Error loading questions:', error);
            return this.FALLBACK_QUESTIONS;
        }
    }
}
