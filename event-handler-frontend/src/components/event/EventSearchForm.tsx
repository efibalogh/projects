import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { TextField, Paper, IconButton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { EventIncoming } from '../../types/event';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '16px',
  boxShadow: theme.palette.mode === 'dark' ? '0 8px 16px rgba(0, 0, 0, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
}));

const SearchForm = styled('form')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
  margin: '0 auto',
});

const FieldsContainer = styled(Box)({
  flex: 1,
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(4, 1fr)',
  '@media (max-width: 900px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
});

type EventSearchFormProps = {
  onSearch: (data: EventIncoming) => void;
  onClear: () => void;
  initialValues: EventIncoming | null;
};

export default function EventSearchForm({ onSearch, onClear, initialValues }: EventSearchFormProps) {
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<EventIncoming>({
    defaultValues: initialValues || {
      name: '',
      location: '',
      startDate: '',
      endDate: '',
    },
  });

  const handleClear = () => {
    reset();
    onClear();
  };

  return (
    <SearchContainer>
      <SearchForm onSubmit={handleSubmit(onSearch)}>
        <IconButton
          onClick={handleClear}
          sx={(theme) => ({
            color: theme.palette.buttons.red.main,
            '&:hover': {
              backgroundColor: `${theme.palette.buttons.red.main}20`,
            },
          })}
        >
          <ClearIcon />
        </IconButton>
        <FieldsContainer>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('events.name')}
                size="small"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('events.location')}
                size="small"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('events.startDate')}
                type="date"
                size="small"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={t('events.endDate')}
                type="date"
                size="small"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />
        </FieldsContainer>
        <IconButton
          type="submit"
          sx={(theme) => ({
            color: theme.palette.buttons.blue.main,
            '&:hover': {
              backgroundColor: `${theme.palette.buttons.blue.main}20`,
            },
          })}
        >
          <SearchIcon />
        </IconButton>
      </SearchForm>
    </SearchContainer>
  );
}
