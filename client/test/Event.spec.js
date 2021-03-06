import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Event from '../src/components/Event';


describe('Event Component', function() {
  // Set this.props URL params manually
  const id = { params: { id: '1' } };
  const wrapper = shallow(<Event match={id} />);

  it('shows an apology instead of event if no permission to view', function() {
    wrapper.setState({ hasPermissionToView: false });
    const apology = 'Sorry, this doesn\'t seem to be one of your events';
    expect(wrapper.contains(<h3>{apology}</h3>)).to.equal(true);
  });

  it('contains the event title', function() {
    wrapper.setState({ title: 'Pool Party', hasPermissionToView: true });
    expect(wrapper.contains(<h1 className="display-2">Pool Party</h1>)).to.equal(true);
  });

  it('contains a form where the user can add a contribution', function() {
    expect(wrapper.contains(<label>Enter your message</label>)).to.equal(true);
  });
});
