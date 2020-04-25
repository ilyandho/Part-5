import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';

import Blog from './Blog';

describe('<ToggableList />', () => {
  let component;
  const updateBlog = jest.fn();
  const deleteBlog = jest.fn();

  beforeEach(() => {
    const user = { username: 'username', name: 'My Name' };
    const blog = {
      likes: 23,
      title: 'My Blog',
      author: 'My Name',
      url: 'http://localhost:3003/api/blogs',
      user: {
        username: 'username',
        name: 'My Name',
        id: '5ea0ba59ba31542f94489f04',
      },
      id: '5ea0bfbe5519901828547045',
    };

    component = render(
      <Blog
        user={user}
        blog={blog}
        update={updateBlog}
        deleteBlog={deleteBlog}
        key="3"
      />
    );
  });

  test('title and author are rendered by default', () => {
    const whenHidden = component.container.querySelector('.previewContent');

    // Title is rendered
    expect(whenHidden).toHaveTextContent('My Blog');
    // Author is rendered
    expect(whenHidden).toHaveTextContent('My Name');
  });

  test('url and number of likes are rendered by default', () => {
    const toggableComp = component.container.querySelector('.toggableContent');

    expect(toggableComp).toHaveStyle('display:none');
  });

  test(' url and number of likes are rendered when the button is clicked', () => {
    const viewButton = component.getByText('view');
    fireEvent.click(viewButton);

    const toggableComp = component.container.querySelector('.toggableContent');
    // url is rendered
    expect(toggableComp).toHaveTextContent('http://localhost:3003/api/blogs');
    // number of likes is rendered
    expect(toggableComp).toHaveTextContent('23');
  });

  test('if the like button is clicked twice, the event handler the component received as props is called twice', () => {
    const like = component.container.querySelector('.like');
    fireEvent.click(like);
    fireEvent.click(like);
    expect(updateBlog.mock.calls).toHaveLength(2);
  });
});
