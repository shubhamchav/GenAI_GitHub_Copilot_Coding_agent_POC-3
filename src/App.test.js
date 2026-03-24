
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('Todo App', () => {
  beforeEach(() => {
    // Mock fetch for all tests
    global.fetch = jest.fn((url, options) => {
      if (url.endsWith('/api/todos') && (!options || options.method === 'GET')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, title: 'Test Todo', description: 'Test Desc', completed: false }
          ])
        });
      }
      if (options && options.method === 'POST') {
        return Promise.resolve({ ok: true });
      }
      if (options && options.method === 'PUT') {
        return Promise.resolve({ ok: true });
      }
      if (options && options.method === 'DELETE') {
        return Promise.resolve({ ok: true });
      }
      return Promise.resolve({ ok: false });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo list', async () => {
    render(<App />);
    expect(await screen.findByText('Test Todo: Test Desc')).toBeInTheDocument();
  });

  test('adds a new todo', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'New Todo' } });
    fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Desc' } });
    fireEvent.click(screen.getByText('Add'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  test('edits a todo', async () => {
    render(<App />);
    fireEvent.click(await screen.findByText('Edit'));
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Edited Todo' } });
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos/1'),
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  test('deletes a todo', async () => {
    render(<App />);
    fireEvent.click(await screen.findByText('Delete'));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/todos/1'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
