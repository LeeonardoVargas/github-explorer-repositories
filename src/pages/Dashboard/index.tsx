import React, {FormEvent, useState} from 'react';
import {FiChevronRight} from 'react-icons/fi';

import api from '../../services/api';
import { Title, Error, Form, Repositories } from './styles';
import logoImg from '../../assets/logo-github-explorer.svg';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [newrepository, setNewRepository] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>([]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
    event.preventDefault();

    if(!newrepository){
      setInputError('Digite um respositório válido');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newrepository}`);
      const repo = response.data;

      setRepositories([...repositories, repo]);
      setNewRepository('');
      setInputError('');
    } catch(err){
      setInputError('Erro na busca por esse repositório');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer"/>
      <Title>Repositórios Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newrepository}
          onChange={(e) => setNewRepository(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar Repositório</button>
      </Form>

      { inputError && <Error>{inputError}</Error> }

      <Repositories>
        {repositories.map(repo => (
          <a key={repo.full_name} href="/repository">
            <img src={repo.owner.avatar_url} alt={repo.owner.login}/>
            <div>
              <strong>{repo.full_name}</strong>
              <span>{repo.description}</span>
            </div>
            <FiChevronRight size={40}/>
          </a>
        ))}
      </Repositories>
    </>
  );
}

export default Dashboard;
