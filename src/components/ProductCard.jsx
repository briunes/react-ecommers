import BlockIcon from '@mui/icons-material/Block';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Collapse, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

const ProductCard = ({ data, addProduct, setFavorite, favorite }) => {
  const [expanded, setExpanded] = useState(false);

  // Stock status logic
  let stockColor = 'success.main';
  let stockText = `In stock`;
  if (data.stock === 0) {
    stockColor = 'error.main';
    stockText = 'Out of stock';
  } else if (data.stock < 10) {
    stockColor = 'warning.main';
    stockText = `Last units!`;
  }

  return (
    <Card
      sx={{
        height: 'fit-content',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 4,
        boxShadow: 2,
        transition: 'box-shadow 0.3s, transform 0.3s',
        position: 'relative',
        '&:hover': {
          boxShadow: 8,
          transform: 'translateY(-4px)',
        },
        minHeight: 420, // Ensures all cards have the same minimum height
      }}
    >
      {/* Favorite icon top right */}
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
        <Tooltip title={favorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            sx={{ bgcolor: 'background.paper', borderRadius: '50%', boxShadow: 1, '&:hover': { bgcolor: '#ffe6e6' } }}
            onClick={() => setFavorite(data.id)}
          >
            {favorite ? <FavoriteIcon color="error" /> : <FavoriteIcon sx={{ color: '#bdbdbd' }} />}
          </IconButton>
        </Tooltip>
      </Box>
      <CardMedia
        component="img"
        height="200"
        image={data.image}
        alt={data.title}
        sx={{ objectFit: 'contain', p: 2, background: '#fafafa', borderRadius: 3,  }}
      />
      <CardContent sx={{ pt: 1, pb: 1, minHeight: 140 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Inventory2Icon sx={{ color: stockColor, mr: 1 }} />
          <Typography variant="body2" sx={{ color: stockColor, fontWeight: 500 }}>
            {stockText}
          </Typography>
        </Box>
        <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: 600 }}>
          {data.title}
        </Typography>
        <Typography variant="subtitle1" color="primary" sx={{ mt: 1, fontWeight: 700 }}>
          ${data.price}
        </Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
        <Button
          size="medium"
          variant="contained"
          color="primary"
          onClick={() => addProduct(data)}
          disabled={data.stock === 0}
          sx={{ borderRadius: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
          startIcon={data.stock === 0 ? <BlockIcon /> : <ShoppingCartIcon />}
        >
          {data.stock === 0 ? 'Unavailable' : 'Add to Cart'}
        </Button>
        <Button
          size="small"
          endIcon={!expanded ? <VisibilityIcon /> : <VisibilityOffIcon />}
          onClick={() => setExpanded((prev) => !prev)}
          sx={{ textTransform: 'none' }}
        >
          {expanded ? 'Hide Details' : 'Show details'}
        </Button>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ px: 2, pb: 2, minHeight: 80 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {data.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <StarIcon sx={{ color: '#FFD700', fontSize: 20, mr: 0.5 }} />
            <Typography variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
              {data.rating?.rate ?? '-'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({data.rating?.count ?? 0} reviews)
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};

export default ProductCard;