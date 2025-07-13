import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initializeGemini, testGeminiConnection } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isStored, setIsStored] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini-api-key');
    if (storedKey) {
      setApiKey(storedKey);
      setIsStored(true);
      onApiKeySet(storedKey);
    }
  }, [onApiKeySet]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini-api-key', apiKey.trim());
      setIsStored(true);
      onApiKeySet(apiKey.trim());
    }
  };

  const handleClear = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
    setIsStored(false);
    setTestResult(null);
    onApiKeySet('');
  };

  const handleTestApi = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma chave API primeiro.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    
    try {
      initializeGemini(apiKey.trim());
      const result = await testGeminiConnection();
      setTestResult(result);
      
      if (result.success) {
        toast({
          title: "Sucesso!",
          description: "API do Gemini está funcionando corretamente.",
          variant: "default"
        });
      } else {
        toast({
          title: "Erro na API",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erro no teste:', error);
      setTestResult({ success: false, message: 'Erro inesperado no teste' });
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro inesperado ao testar a API.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="card-glass max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Key className="w-6 h-6 text-accent" />
        <h3 className="text-xl font-semibold">API Key do Gemini</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="api-key" className="text-sm font-medium">
            Chave da API
          </Label>
          <div className="relative mt-1">
            <Input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {isStored && (
          <div className="bg-success/20 border border-success/20 rounded-lg p-3">
            <p className="text-sm text-success">
              ✓ API Key salva e configurada
            </p>
          </div>
        )}

        {testResult && (
          <div className={`border rounded-lg p-3 ${
            testResult.success 
              ? 'bg-success/20 border-success/20' 
              : 'bg-destructive/20 border-destructive/20'
          }`}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
              <p className={`text-sm ${
                testResult.success ? 'text-success' : 'text-destructive'
              }`}>
                {testResult.message}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleSave}
            disabled={!apiKey.trim() || isStored}
            className="flex-1"
          >
            {isStored ? 'Salva' : 'Salvar'}
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleTestApi}
            disabled={!apiKey.trim() || isTesting}
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testando...
              </>
            ) : (
              'Testar API'
            )}
          </Button>
          
          {isStored && (
            <Button 
              variant="outline"
              onClick={handleClear}
            >
              Limpar
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          A chave será salva localmente no seu navegador para uso durante a sessão.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyInput;