import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Button, List, ListItem, ListItemText } from '@mui/material';

import HeaderText from './HeaderText';
import { ContentContainer, ButtonGroup, ButtonContainer } from './StyledComponents';

const StyledList = styled(List)({
  marginTop: 0,
  marginBottom: 0,
});

const StyledListItem = styled(ListItem)(({ theme }) => {
  const isColorTheme = theme.palette.primary.main === '#7f3593';
  const isDarkTheme = theme.palette.mode === 'dark';

  return {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:first-of-type': {
      paddingTop: theme.spacing(0),
    },
    '&:last-child': {
      borderBottom: 'none',
    },
    '& .MuiListItemText-primary': {
      color: (() => {
        if (isColorTheme) return '#2c3e50';
        if (isDarkTheme) return '#e0e0e0';
        return '#333333';
      })(),
    },
    '& .MuiListItemText-secondary': {
      color: (() => {
        if (isColorTheme) return '#555555';
        if (isDarkTheme) return '#cccccc';
        return '#555555';
      })(),
    },
  };
});

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: 500,
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

type GenericListProps<T> = {
  title: string | ReactNode;
  items: T[];
  isLoading: boolean;
  onDelete?: (id: number) => Promise<void>;
  getItemId: (item: T) => number;
  getItemPrimaryText: (item: T) => string;
  getItemSecondaryText?: (item: T) => string;
  getViewLink: (id: number) => string;
  getEditLink?: (id: number) => string;
  createNewText?: string;
  createNewLink?: string;
  emptyListMessage: string;
  showActions?: boolean;
  loadingMessage?: string;
  showBackButton?: boolean;
};

function GenericList<T>({
  title,
  items,
  isLoading,
  onDelete = undefined,
  getItemId,
  getItemPrimaryText,
  getItemSecondaryText = () => '',
  getViewLink,
  getEditLink = undefined,
  createNewText = undefined,
  createNewLink = undefined,
  emptyListMessage,
  showActions = true,
  loadingMessage = 'Loading...',
  showBackButton = false,
}: GenericListProps<T>) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <ContentContainer>
        <HeaderText message={loadingMessage} />
      </ContentContainer>
    );
  }

  if (!items || items.length === 0) {
    return (
      <ContentContainer>
        <HeaderText message={emptyListMessage} button={createNewText} buttonLink={createNewLink} />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <HeaderText message={title} button={createNewText} buttonLink={createNewLink} />
      <StyledList>
        {items.map((item) => {
          const id = getItemId(item);
          return (
            <StyledListItem key={id}>
              <ListItemText
                primary={<StyledLink to={getViewLink(id)}>{getItemPrimaryText(item)}</StyledLink>}
                secondary={getItemSecondaryText?.(item)}
              />
              {showActions && (
                <ButtonGroup>
                  {getEditLink && (
                    <Button
                      component={Link}
                      to={getEditLink(id)}
                      size="large"
                      sx={(theme) => {
                        const isColorTheme = theme.palette.primary.main === '#7f3593';
                        return {
                          color: isColorTheme ? '#ffffff' : theme.palette.buttons.blue.main,
                          background: isColorTheme ? theme.palette.buttons.blue.main : 'transparent',
                          '&:hover': {
                            background: isColorTheme ? theme.palette.buttons.blue.main : 'transparent',
                            filter: isColorTheme ? theme.palette.buttons.blue.hover : 'none',
                            backgroundColor: !isColorTheme ? theme.palette.buttons.blue.hover : 'transparent',
                          },
                        };
                      }}
                    >
                      {t('common.editButton')}
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      onClick={() => onDelete(id)}
                      size="large"
                      sx={(theme) => {
                        const isColorTheme = theme.palette.primary.main === '#7f3593';
                        return {
                          color: isColorTheme ? '#ffffff' : theme.palette.buttons.red.main,
                          background: isColorTheme ? theme.palette.buttons.red.main : 'transparent',
                          '&:hover': {
                            background: isColorTheme ? theme.palette.buttons.red.main : 'transparent',
                            filter: isColorTheme ? theme.palette.buttons.red.hover : 'none',
                            backgroundColor: !isColorTheme ? theme.palette.buttons.red.hover : 'transparent',
                          },
                        };
                      }}
                    >
                      {t('common.deleteButton')}
                    </Button>
                  )}
                </ButtonGroup>
              )}
            </StyledListItem>
          );
        })}
      </StyledList>
      {showBackButton && (
        <ButtonContainer>
          <Button
            onClick={() => navigate(-1)}
            size="large"
            sx={(theme) => {
              const isColorTheme = theme.palette.primary.main === '#7f3593';
              return {
                color: isColorTheme ? '#ffffff' : theme.palette.buttons.orange.main,
                background: isColorTheme ? theme.palette.buttons.orange.main : 'transparent',
                '&:hover': {
                  background: isColorTheme ? theme.palette.buttons.orange.main : 'transparent',
                  filter: isColorTheme ? theme.palette.buttons.orange.hover : 'none',
                  backgroundColor: !isColorTheme ? theme.palette.buttons.orange.hover : 'transparent',
                },
              };
            }}
          >
            {t('common.backButton')}
          </Button>
        </ButtonContainer>
      )}
    </ContentContainer>
  );
}

export default GenericList;
