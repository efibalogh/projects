import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { Box, Button, Typography } from '@mui/material';

import HeaderText from './HeaderText';
import { ContentContainer, ButtonContainer, ErrorText } from './StyledComponents';

const FormContent = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  marginTop: theme.spacing(3.5),
  gap: theme.spacing(2),
}));

export type GenericFormProps<T extends FieldValues> = {
  title: string;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => Promise<void>;
  children: ReactNode;
  submitLabel?: string;
  showCancel?: boolean;
  error?: string | null;
  alternateLink?: string;
  alternateText?: string;
};

function GenericForm<T extends FieldValues>({
  title,
  form,
  onSubmit,
  children,
  submitLabel = 'Submit',
  showCancel = true,
  error = null,
  alternateLink = undefined,
  alternateText = undefined,
}: GenericFormProps<T>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleSubmit } = form;

  const isAuthVariant = Boolean(alternateLink && alternateText);

  return (
    <ContentContainer>
      <HeaderText message={title} />
      <FormContent onSubmit={handleSubmit(onSubmit)}>
        {children}

        {error && <ErrorText variant="body2">{error}</ErrorText>}

        {isAuthVariant ? (
          <ButtonContainer>
            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Typography variant="body1" fontWeight={500}>
                {alternateText}
              </Typography>
              <Button
                onClick={() => navigate(alternateLink ?? '')}
                size="large"
                sx={(theme) => {
                  const isColorTheme = theme.palette.primary.main === '#7f3593';
                  const buttonColor = alternateLink?.includes('login') ? 'blue' : 'green';
                  return {
                    color: isColorTheme ? '#ffffff' : theme.palette.buttons[buttonColor].main,
                    background: isColorTheme ? theme.palette.buttons[buttonColor].main : 'transparent',
                    '&:hover': {
                      background: isColorTheme ? theme.palette.buttons[buttonColor].main : 'transparent',
                      filter: isColorTheme ? theme.palette.buttons[buttonColor].hover : 'none',
                      backgroundColor: !isColorTheme ? theme.palette.buttons[buttonColor].hover : 'transparent',
                    },
                  };
                }}
              >
                {alternateLink?.includes('login') ? t('common.signInButton') : t('common.signUpButton')}
              </Button>
            </Box>
            <Button
              type="submit"
              size="large"
              sx={(theme) => {
                const isColorTheme = theme.palette.primary.main === '#7f3593';
                const buttonColor = alternateLink?.includes('login') ? 'green' : 'blue';
                return {
                  color: isColorTheme ? '#ffffff' : theme.palette.buttons[buttonColor].main,
                  background: isColorTheme ? theme.palette.buttons[buttonColor].main : 'transparent',
                  '&:hover': {
                    background: isColorTheme ? theme.palette.buttons[buttonColor].main : 'transparent',
                    filter: isColorTheme ? theme.palette.buttons[buttonColor].hover : 'none',
                    backgroundColor: !isColorTheme ? theme.palette.buttons[buttonColor].hover : 'transparent',
                  },
                };
              }}
            >
              {submitLabel}
            </Button>
          </ButtonContainer>
        ) : (
          <ButtonContainer>
            <Button
              type="submit"
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
              {submitLabel}
            </Button>
            {showCancel && (
              <Button
                onClick={() => navigate(-1)}
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
                {t('common.cancelButton')}
              </Button>
            )}
          </ButtonContainer>
        )}
      </FormContent>
    </ContentContainer>
  );
}

export default GenericForm;
