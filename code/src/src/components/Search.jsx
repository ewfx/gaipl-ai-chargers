import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000/api/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data.status === "error") {
          throw new Error(data.message);
        }
        
        setResults(data);
      } catch (err) {
        setError(err.message || "Search failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getDocumentTitle = (result) => {
    // Handle knowledge base documents
    if (result.type === 'knowledge_base') {
      return result.source?.['KA Number'] 
        ? `KB-${result.source['KA Number']}: ${result.source.Title || 'Knowledge Article'}`
        : 'Knowledge Base Article';
    }
    
    // Handle incident documents
    if (result.type === 'incident') {
      return result.source?.['Incident Number']
        ? `INC-${result.source['Incident Number']}: ${result.source['Short Description'] || 'Incident Report'}`
        : 'Incident Report';
    }
    
    return 'Document';
  };

  const getDocumentContent = (result) => {
    if (result.type === 'knowledge_base') {
      return [
        result.source?.Summary,
        result.source?.ResolutionSteps && `Resolution Steps: ${result.source.ResolutionSteps}`
      ].filter(Boolean).join('\n\n');
    }
    
    if (result.type === 'incident') {
      return [
        result.source?.['Short Description'],
        result.source?.['Resolution Notes'] && `Resolution Notes: ${result.source['Resolution Notes']}`
      ].filter(Boolean).join('\n\n');
    }
    
    return result.text || 'No content available';
  };

  return (
    <Box sx={{ p: 3 }}>
      <form onSubmit={handleSearch}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search technical knowledge base..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !query.trim()}
            sx={{ px: 4 }}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </Box>
      </form>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Search Results for: "{results.query}"
          </Typography>

          {results.insights && (
            <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Technical Insights
                </Typography>
                <Typography variant="body1" whiteSpace="pre-line">
                  {results.insights}
                </Typography>
              </CardContent>
            </Card>
          )}

          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 'bold' }}>Matching Documents ({results.results?.length || 0})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {results.results?.map((result, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={result.type === 'knowledge_base' ? 'KB' : 'INC'} 
                              color={result.type === 'knowledge_base' ? 'primary' : 'secondary'} 
                              size="small"
                            />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {getDocumentTitle(result)}
                            </Typography>
                            <Chip 
                              label={`Score: ${result.score?.toFixed(2) || 'N/A'}`}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            component="div"
                            sx={{ mt: 1 }}
                          >
                            {getDocumentContent(result).split('\n\n').map((paragraph, i) => (
                              <div key={i} style={{ marginBottom: i > 0 ? '8px' : 0 }}>
                                {paragraph}
                              </div>
                            ))}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < results.results.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Box>
  );
}

export default Search;