/* -*- Mode: C++; tab-width: 4; indent-tabs-mode: nil; c-basic-offset: 4; c-file-style: "linux" -*- */
#ifndef BOID_HPP
#define BOID_HPP

//
#include <cstddef>
#include <deque>

namespace HoneyMummies
{
  class Boid
  {
  public:
    Boid( HoneyMummiesParams & ar_params )
    {};

    ~Boid()
    {};

    template< Function_T >
    void update_position( Function_T * ip_update_funtion )
    {};
    
  private:
    uint32_t m_id;

    double * mp_position;
    double * mp_velecity;
    double * mp_acceleration;
    double * mp_hamiltonian;
    double * mp_lagrangian;

    std::deque< Boid * > m_neighbors;
  }
}
#endif
