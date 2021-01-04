import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Form } from '@unform/web';
import { FiArrowLeft, FiCamera, FiLock, FiMail, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';

import { Link, useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import Input from '../../components/Input';

import { Avatar, Content, Container } from './styles';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { getValidationErrors } from '../../utils/getValidationErrors';

interface ProfileFormData {
  name: string;
  email: string;
  current_password: string;
  new_password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('o campo e-mail é obrigatório')
            .email('Digite um email válido'),
          name: Yup.string().required('O campo nome é obrigatório'),
          current_password: Yup.string(),
          new_password: Yup.string().when('current_password', {
            is: value => !!value,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().when('current_password', {
            is: value => !!value,
            then: Yup.string()
              .required('Campo obrigatório')
              .oneOf([Yup.ref('new_password')], 'Senhas não são iguais'),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, { abortEarly: false });

        const {
          email,
          name,
          current_password,
          new_password,
          password_confirmation,
        } = data;

        const passwordFormData = {
          current_password,
          new_password,
          password_confirmation,
        };

        const formData = {
          email,
          name,
          ...(current_password ? passwordFormData : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: 'Perfil atualizado com sucesso',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização do perfil',
          description: 'Por favor, tente novamente',
        });
      }
    },
    [addToast, updateUser, history],
  );

  /**
   * upldate de avatar
   *
   *  - add input do tipo file
   *  - trocar o button dentro do avatar por label
   *
   *
   *  - criar método para update do avatar
   *  - pegar a imagem
   *  - passar para o FormData
   * -  enviar intancia de data para api
   *
   *  -- para que a foto na página de perfil seja atualizado após a chamda da api
   * devemos criar u método para alterar o avatar url do usuário no context e no localstorage
   */

  const handleUpdateAvatar = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      try {
        const { files } = event.target;

        if (files) {
          const data = new FormData();
          const avatarImage = files[0];

          data.append('avatar', avatarImage);

          const response = await api.patch('/users/avatar', data);

          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Sua foto de perfil foi atualizada',
          });
        }
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro ao atualizar sua foto de perfil',
          description: 'Por favor, tente novamente',
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <Link to="/dashboard">
          <FiArrowLeft />
        </Link>
      </header>

      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{ name: user.name, email: user.email }}
        >
          <Avatar>
            <img src={user.avatar_url} alt={user.name} />

            <label htmlFor="avatar">
              <input type="file" id="avatar" onChange={handleUpdateAvatar} />
              <FiCamera />
            </label>
          </Avatar>

          <h1>Meu perfil</h1>

          <Input name="name" placeholder="Nome" icon={FiUser} />
          <Input name="email" placeholder="E-mail" icon={FiMail} />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="current_password"
            placeholder="Senha atual"
            icon={FiLock}
            type="password"
          />

          <Input
            name="new_password"
            placeholder="Nova senha"
            icon={FiLock}
            type="password"
          />

          <Input
            name="password_confirmation"
            placeholder="Confirmar senha"
            icon={FiLock}
            type="password"
          />

          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
