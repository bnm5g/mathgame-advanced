import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QuestionLoader } from './loader';

describe('QuestionLoader', () => {
    const mockQuestions = [
        {
            id: 'test_001',
            text: 'Test Question',
            answers: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            points: 10
        }
    ];

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    it('loadQuestions returns parsed questions on success', async () => {
        (fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({ questions: mockQuestions })
        });

        const questions = await QuestionLoader.loadQuestions();
        expect(questions).toHaveLength(1);
        expect(questions[0].id).toBe('test_001');
        expect(fetch).toHaveBeenCalledWith('/questions/calculus.json');
    });

    it('should return fallbacks on fetch error', async () => {
        (fetch as any).mockResolvedValue({ ok: false });

        const questions = await QuestionLoader.loadQuestions();
        expect(questions).toHaveLength(1);
        expect(questions[0].id).toBe('fallback_001');
    });

    it('loadQuestions returns fallback on network failure', async () => {
        (fetch as any).mockRejectedValue(new Error('Network error'));

        const questions = await QuestionLoader.loadQuestions();
        expect(questions.length).toBeGreaterThan(0);
        expect(questions[0].id).toContain('fallback');
    });
});
