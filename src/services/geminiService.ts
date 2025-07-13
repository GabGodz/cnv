
import { GoogleGenerativeAI } from '@google/generative-ai';

interface UserProfile {
  name: string;
  knowsCNV: boolean;
  answers: string[];
}

interface Scenario {
  situation: string;
  options: {
    passive: string;
    cnv: string;
    neutral: string;
    problematic: string;
  };
}

interface FeedbackResponse {
  immediate: string;
  detailed: string;
  points: number;
}

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

// Função para testar a conectividade da API
export const testGeminiConnection = async (): Promise<{ success: boolean; message: string }> => {
  if (!genAI) {
    return { success: false, message: 'Gemini não inicializado' };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('Responda apenas: OK');
    const response = await result.response;
    const text = response.text();
    
    console.log('Teste de conectividade - Resposta:', text);
    return { success: true, message: 'API funcionando corretamente' };
  } catch (error: any) {
    console.error('Teste de conectividade falhou:', error);
    
    if (error.message?.includes('API_KEY') || error.message?.includes('invalid') || error.status === 400) {
      return { success: false, message: 'Chave API inválida' };
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
      return { success: false, message: 'Limite de uso atingido' };
    }
    
    return { success: false, message: `Erro na API: ${error.message}` };
  }
};

// Cenários de fallback caso a API falhe
const fallbackScenarios: Scenario[] = [
  {
    situation: "Durante uma reunião, um colega interrompe você constantemente enquanto você apresenta suas ideias.",
    options: {
      passive: "Você para de falar e deixa o colega assumir a apresentação.",
      cnv: "Você diz: 'Percebo que você tem pontos importantes. Posso terminar minha ideia e depois ouvir você?'",
      neutral: "Você continua falando mais alto para ser ouvido.",
      problematic: "Você diz: 'Você sempre me interrompe! Deixe-me falar!'"
    }
  },
  {
    situation: "Seu chefe critica seu trabalho na frente de toda a equipe, fazendo você se sentir humilhado.",
    options: {
      passive: "Você abaixa a cabeça e não diz nada, guardando a raiva para si.",
      cnv: "Você diz: 'Entendo sua preocupação. Podemos conversar em particular sobre como melhorar?'",
      neutral: "Você diz: 'Ok, vou revisar isso' e muda de assunto.",
      problematic: "Você responde: 'Isso não é justo! Você nunca reconhece meu esforço!'"
    }
  },
  {
    situation: "Um colega sempre deixa tarefas para a última hora, afetando o cronograma da equipe.",
    options: {
      passive: "Você faz o trabalho dele para não atrasar o projeto.",
      cnv: "Você diz: 'Notei que alguns prazos têm sido apertados. Como podemos organizar melhor nosso tempo?'",
      neutral: "Você menciona o problema para o chefe sem falar com o colega primeiro.",
      problematic: "Você diz: 'Você é sempre irresponsável e atrapalha todo mundo!'"
    }
  }
];

export const generateScenarios = async (userProfile: UserProfile): Promise<Scenario[]> => {
  if (!genAI) throw new Error('Gemini não inicializado');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `
Como especialista em Comunicação Não Violenta (CNV), crie EXATAMENTE 10 cenários do COTIDIANO CORPORATIVO personalizados para ${userProfile.name}.

Perfil do usuário:
- Nome: ${userProfile.name}
- Conhece CNV: ${userProfile.knowsCNV ? 'Sim' : 'Não'}
- Respostas do questionário: ${userProfile.answers.join(', ')}

IMPORTANTE: Crie situações do DIA A DIA no AMBIENTE CORPORATIVO (reuniões, conversas com colegas, feedbacks, conflitos no trabalho, comunicação com chefe, etc).

Para cada cenário, forneça:
1. Uma situação corporativa cotidiana específica e realista
2. Exatamente 4 opções de resposta com TAMANHO SIMILAR (máximo 2 linhas cada):
   - PASSIVA: Evita o conflito, não resolve (máximo 2 linhas)
   - CNV: Aplica CNV de forma CONCISA (máximo 2 linhas)
   - NEUTRA: Resposta comum mas não resolve (máximo 2 linhas)  
   - PROBLEMÁTICA: Resposta conflituosa (máximo 2 linhas)

TODAS as respostas devem ter tamanho similar, ser concisas e SEM caracteres especiais como asteriscos, aspas duplas ou simples.

Responda em JSON válido no formato:
{
  "scenarios": [
    {
      "situation": "descrição da situação corporativa cotidiana",
      "options": {
        "passive": "resposta passiva concisa",
        "cnv": "resposta CNV concisa",
        "neutral": "resposta neutra concisa",
        "problematic": "resposta problemática concisa"
      }
    }
  ]
}
`;

  try {
    console.log('Iniciando geração de cenários com Gemini 2.0 Flash...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Resposta do Gemini recebida:', text.substring(0, 200) + '...');
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('Resposta não contém JSON válido:', text);
      throw new Error('Formato de resposta inválido - JSON não encontrado');
    }
    
    const data = JSON.parse(jsonMatch[0]);
    
    if (!data.scenarios || !Array.isArray(data.scenarios) || data.scenarios.length === 0) {
      console.error('Cenários não encontrados na resposta:', data);
      throw new Error('Nenhum cenário válido foi gerado');
    }
    
    console.log(`Sucesso! ${data.scenarios.length} cenários gerados pela API`);
    return data.scenarios;
  } catch (error: any) {
    console.error('Erro detalhado ao gerar cenários:', {
      message: error.message,
      status: error.status,
      details: error.details || error,
      apiKeyPresent: !!genAI
    });
    
    // Verifica se é erro de API key ou quota
    if (error.message?.includes('API_KEY') || error.message?.includes('invalid') || error.status === 400) {
      console.error('Erro de API Key detectado');
      throw new Error('Chave API inválida ou não configurada. Verifique sua chave do Google Gemini.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit') || error.status === 429) {
      console.error('Erro de quota detectado');
      throw new Error('Limite de uso da API atingido. Tente novamente mais tarde.');
    }
    
    if (error.message?.includes('blocked') || error.message?.includes('safety')) {
      console.error('Conteúdo bloqueado por segurança');
      throw new Error('Conteúdo bloqueado por políticas de segurança.');
    }
    
    console.warn('Usando cenários de fallback devido ao erro na API');
    
    // Retorna cenários de fallback apenas para erros de rede ou temporários
    return fallbackScenarios;
  }
};

export const generateFeedback = async (
  scenario: string,
  chosenOption: string,
  optionType: 'passive' | 'cnv' | 'neutral' | 'problematic',
  userName: string
): Promise<FeedbackResponse> => {
  if (!genAI) throw new Error('Gemini não inicializado');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const pointsMap = {
    cnv: 10,
    neutral: 5,
    passive: 3,
    problematic: 0
  };

  const prompt = `
Como especialista em CNV, analise a escolha de ${userName} no seguinte cenário:

CENÁRIO: ${scenario}
RESPOSTA ESCOLHIDA: ${chosenOption}
TIPO DA RESPOSTA: ${optionType}

Forneça feedback em JSON:
{
  "immediate": "feedback imediato curto e personalizado usando o nome ${userName}",
  "detailed": "explicação detalhada sobre por que a opção CNV seria ideal, mencionando os princípios da CNV aplicados",
  "points": ${pointsMap[optionType]}
}

O feedback deve ser construtivo, educativo, motivador e SEM caracteres especiais como asteriscos, aspas duplas ou simples. Use linguagem natural e humana.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Formato de resposta inválido');
    
    const data = JSON.parse(jsonMatch[0]);
    return {
      immediate: data.immediate?.replace(/[*"']/g, ''),
      detailed: data.detailed?.replace(/[*"']/g, ''),
      points: pointsMap[optionType]
    };
  } catch (error) {
    console.error('Erro ao gerar feedback:', error);
    throw new Error('Falha ao gerar feedback');
  }
};

export const generateFinalFeedback = async (
  userName: string,
  totalScore: number,
  totalQuestions: number,
  answerCategories: { cnv: number; neutral: number; passive: number; problematic: number }
): Promise<string> => {
  if (!genAI) throw new Error('Gemini não inicializado');

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const percentage = (totalScore / (totalQuestions * 10)) * 100;

  const prompt = `
Crie um feedback final personalizado para ${userName} sobre seu desempenho no treinamento de CNV.

PONTUAÇÃO: ${totalScore} de ${totalQuestions * 10} pontos possíveis (${percentage.toFixed(1)}%)
DISTRIBUIÇÃO DAS RESPOSTAS:
- Respostas CNV: ${answerCategories.cnv} de ${totalQuestions}
- Respostas Neutras: ${answerCategories.neutral} de ${totalQuestions}
- Respostas Passivas: ${answerCategories.passive} de ${totalQuestions}
- Respostas Problemáticas: ${answerCategories.problematic} de ${totalQuestions}

Instruções para o feedback:
1. Use o nome ${userName} de forma personalizada
2. Seja motivador e construtivo
3. Destaque pontos fortes baseados no desempenho
4. Sugira áreas específicas de melhoria
5. Relacione os resultados com benefícios no ambiente corporativo
6. Use tom profissional mas acolhedor
7. Remova completamente asteriscos, aspas duplas ou simples
8. Use linguagem natural e conversacional
9. Máximo 250 palavras
10. Termine com uma mensagem motivadora

Escreva apenas o texto do feedback, sem formatação especial.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove caracteres especiais e formatação
    text = text.replace(/[*"'`#]/g, '');
    text = text.replace(/\*\*/g, '');
    text = text.replace(/\n\s*\n/g, '\n');
    text = text.trim();
    
    return text;
  } catch (error) {
    console.error('Erro ao gerar feedback final:', error);
    
    // Fallback em caso de erro
    let fallbackMessage = `Parabéns, ${userName}! `;
    
    if (percentage >= 80) {
      fallbackMessage += `Você teve um excelente desempenho com ${totalScore} pontos! Demonstrou forte domínio dos princípios de CNV.`;
    } else if (percentage >= 60) {
      fallbackMessage += `Você teve um bom desempenho com ${totalScore} pontos! Está no caminho certo para dominar a CNV.`;
    } else if (percentage >= 40) {
      fallbackMessage += `Você fez um bom esforço com ${totalScore} pontos! Há espaço para crescimento na aplicação da CNV.`;
    } else {
      fallbackMessage += `Você completou o treinamento com ${totalScore} pontos! Este é apenas o início da sua jornada de aprendizado em CNV.`;
    }
    
    fallbackMessage += ` Continue praticando essas habilidades no seu dia a dia corporativo. A Comunicação Não Violenta é uma ferramenta poderosa para melhorar relacionamentos e aumentar a produtividade no trabalho. Parabéns por investir no seu desenvolvimento pessoal e profissional!`;
    
    return fallbackMessage;
  }
};
