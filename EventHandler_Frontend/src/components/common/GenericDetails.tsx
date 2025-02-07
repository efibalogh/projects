import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';

import HeaderText from './HeaderText';
import { ContentContainer, ContentWrapper, ButtonContainer, ButtonGroup } from './StyledComponents';

const DetailsField = styled(Typography)(({ theme }) => {
  const isColorTheme = theme.palette.primary.main === '#7f3593';
  const isDarkTheme = theme.palette.mode === 'dark';

  let textColor = '#333333';
  if (isColorTheme) {
    textColor = '#2c3e50';
  } else if (isDarkTheme) {
    textColor = '#e0e0e0';
  }

  return {
    paddingLeft: theme.spacing(2),
    color: textColor,
    fontSize: '1.125rem',
    fontWeight: 500,
    '& strong': {
      marginRight: theme.spacing(1),
      fontWeight: 700,
    },
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
  };
});

type DetailField = {
  label: string | ReactNode;
  value: string | number | null | ReactNode;
};

type GenericDetailsProps = {
  title: string;
  isLoading: boolean;
  fields: DetailField[];
  editLink?: string;
  onDelete?: () => Promise<void>;
  showActions?: boolean;
  createNewLink?: string;
  createNewText?: string;
  createButtonLink?: string;
  createButtonText?: string;
};

function GenericDetails({
  title,
  isLoading,
  fields,
  editLink = undefined,
  onDelete = undefined,
  showActions = true,
  createNewLink = undefined,
  createNewText = undefined,
  createButtonLink = undefined,
  createButtonText = undefined,
}: GenericDetailsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <ContentContainer>
        <HeaderText message={t('common.loading')} />
      </ContentContainer>
    );
  }

  if (fields.length === 0) {
    return (
      <ContentContainer>
        <HeaderText message={t('common.errorLoading')} />
      </ContentContainer>
    );
  }

  return (
    <ContentContainer>
      <HeaderText message={title} button={createNewText} buttonLink={createNewLink} />
      <ContentWrapper>
        {fields.map((field) => (
          <DetailsField key={typeof field.label === 'string' ? field.label : field.label?.toString()} variant="body1">
            <strong>{field.label}:</strong> {field.value}
          </DetailsField>
        ))}
      </ContentWrapper>

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
        {showActions && (
          <ButtonGroup>
            {createButtonLink && createButtonText && (
              <Button
                component={Link}
                to={createButtonLink}
                size="large"
                sx={(theme) => {
                  const isColorTheme = theme.palette.primary.main === '#7f3593';
                  return {
                    color: isColorTheme ? '#ffffff' : theme.palette.buttons.green.main,
                    background: isColorTheme ? theme.palette.buttons.green.main : 'transparent',
                    '&:hover': {
                      background: isColorTheme ? theme.palette.buttons.green.main : 'transparent',
                      filter: isColorTheme ? theme.palette.buttons.green.hover : 'none',
                      backgroundColor: !isColorTheme ? theme.palette.buttons.green.hover : 'transparent',
                    },
                  };
                }}
              >
                {createButtonText}
              </Button>
            )}
            {editLink && (
              <Button
                component={Link}
                to={editLink}
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
                onClick={onDelete}
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
      </ButtonContainer>
    </ContentContainer>
  );
}

export default GenericDetails;
