import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';

import AddBlogForm from './AddBlogForm';

describe('<AddBlogForm />,', () => {
  const addBlog = jest.fn();
  const component = render(<AddBlogForm addBlog={addBlog} />);

  test('the form calls the event handler it received as props with the right details when a new blog ', () => {
    const form = component.container.querySelector('#form');
    const urlInput = component.container.querySelector('.url');
    const titleInput = component.container.querySelector('.title');

    // Fill the url input
    fireEvent.change(urlInput, {
      target: { value: 'testingurl.com' },
    });

    // Fill the title input
    fireEvent.change(titleInput, {
      target: { value: 'Testing Blog' },
    });

    fireEvent.submit(form);

    // the details passed to the form
    const url = addBlog.mock.calls[0][0]['url'];
    const title = addBlog.mock.calls[0][0]['title'];

    // Check the passed addBlog fn is call once
    expect(addBlog.mock.calls).toHaveLength(1);

    // Check that proper attributes are passed to the addBlog fn
    expect(url).toBe('testingurl.com');
    expect(title).toBe('Testing Blog');

    // console.log(addBlog.mock.calls[0][0]['url']);
  });
});
